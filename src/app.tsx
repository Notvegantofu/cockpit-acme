/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect, useState } from 'react';
import { HorizontalNav } from 'shared/HorizontalNav';
import { DomainTable, AcmeData } from './components/DomainTable';
import { AddDomainForm } from './components/AddDomainForm'
import { Divider,  } from '@patternfly/react-core';
import cockpit from 'cockpit'
import sampleData from './sampleData.js'

export const devMode = false;

export const Application = () => {
    const rowState = useState<AcmeData[]>([]);
    const [ready, setReady] = useState(false);
    const setRows = rowState[1];
    const pages = ["List", "Add"];
    const [ currentPage, setCurrentPage ] = useState("List");
    const addDomainForm = <AddDomainForm updateRows={updateRows}/>;
    const domainTable = <DomainTable dataState={rowState} ready={ready}/>;

    useEffect(() => {
      updateRows();
    }, []);

    function renderPage() {
      switch(cockpit.location.path[0]) {
        case 'Add': return addDomainForm;
        default: return domainTable;
      }
    }

    function getACMEList() {
      if (devMode) {
        return new Promise<string>((resolve) => setTimeout(() => resolve(sampleData), 3000));
      }
      return cockpit.spawn(["sudo", "-u", "acme", "/usr/local/bin/acme.sh", "--list", "--listraw"], {superuser: 'require'});
    }

    function getCertificateList() {
      return cockpit.spawn(["ls", "/etc/haproxy/certs/"])
    }

    async function processData() {
      const [acmeData, certificateData] = await Promise.all([getACMEList(), getCertificateList()])
      if (!acmeData) {
        console.error("No data");
        return [];
      }
      let certificates = certificateData.split('\n').filter(value => value !== "");
      const lines = acmeData.split('\n').filter(value => value !== "");
      lines.shift();
      return lines.map((value) => {
        const [ mainDomain, _, sanDomains, __, created, renew ] = value.split("|");
        const certIndex = certificates.indexOf(`${mainDomain}.pem`)
        if (certIndex !== -1) {
          certificates.splice(certIndex, 1)
        }
        const acmeDate: AcmeData = { mainDomain: mainDomain, sanDomains: sanDomains, created: created, renew: renew, hasCertificate: certIndex !== -1, hasACME: true};
        return acmeDate;
      }).concat(certificates.map(certificate => {return {mainDomain: certificate.replace(/\.pem$/, ""), sanDomains: "", created: "unknown", renew: "unknown", hasCertificate: true, hasACME: false}}));
    }

    async function updateRows() {
      setReady(false);
      await processData()
        .then(setRows)
        .then(() => setReady(true))
        .catch(error => console.error(error));
    }


    return (
        <>
            <HorizontalNav
              pages={pages}
              setCurrentPage={setCurrentPage}
            />
            <Divider/>
            {renderPage()}
        </>
    );
};
