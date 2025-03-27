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
import { HorizontalNav } from './components/HorizontalNav';
import { DomainTable, AcmeData } from './components/DomainTable';
import { AddDomainForm } from './components/AddDomainForm'
import { Divider,  } from '@patternfly/react-core';
import cockpit from 'cockpit'
import sampleData from './sampleData.js'

export const devMode = false;

export const Application = () => {
    const [content, setContent] = useState(0);
    const rowState = useState<AcmeData[]>([]);
    const [ready, setReady] = useState(false);
    const setRows = rowState[1];

    function getCertificateList() {
      if (devMode) {
        return new Promise<string>((resolve) => setTimeout(() => resolve(sampleData), 3000));
      }
      return cockpit.spawn(["sudo", "-u", "acme", "/usr/local/bin/acme.sh", "--list", "--listraw"], {superuser: 'require'});
    }

    function processData(data: string) {
        if (!data) {
          console.error("No data");
          return [];
        }
        let lines = data.split('\n');
        lines.shift();
        lines = lines.filter(value => value !== "");
        return lines.map((value) => {
          const [ mainDomain, _, sanDomains, __, created, renew ] = value.split("|");
          const acmeData: AcmeData = { mainDomain: mainDomain, sanDomains: sanDomains, created: created, renew: renew};
          return acmeData;
        })
    }

    function updateRows() {
      setReady(false);
      getCertificateList()
        .then(result => setRows(processData(result)))
        .then(() => setReady(true))
        .catch(error => console.error(error));
    }

    useEffect(() => {
      updateRows();
    }, []);

    const actions= [
      <DomainTable dataState={rowState} ready={ready}/>,
      <AddDomainForm updateRows={updateRows}/>
    ]

    return (
        <>
            <HorizontalNav setAction={setContent}/>
            <Divider/>
            {actions[content]}
        </>
    );
};
