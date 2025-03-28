import React from 'react';
import { Tr, Td } from '@patternfly/react-table';
import { StandardTable, HeaderValue } from 'shared/StandardTable'
import { ConfirmActionModal } from 'shared/ConfirmActionModal'
import cockpit from 'cockpit';
import { devMode } from '../app'
import { TrashIcon } from '@patternfly/react-icons';

export interface AcmeData {
  mainDomain: string;
  sanDomains: string;
  created: string;
  renew: string;
  hasCertificate: boolean;
  hasACME: boolean;
}

interface TableProps {
  dataState: [AcmeData[], React.Dispatch<React.SetStateAction<AcmeData[]>>];
  ready: boolean;
}

export const DomainTable: React.FunctionComponent<TableProps> = ({ dataState: [ data, setData ], ready }) => {

  function removeEntry(domain: string) {
    if (devMode) {
      const date = data.find(date => date.mainDomain === domain)!;
      date.sanDomains = "";
      date.created = "unknown";
      date.renew = "unknown";
      date.hasACME = false;
      setData(data.filter((row) => row.mainDomain !== domain || row.hasCertificate));
      return;
    }
    cockpit.spawn(["sudo", "-u", "acme", "/usr/local/bin/acme.sh", "--remove", "-d", domain], {superuser: 'require'})
      .then(() => {const date = data.find(date => date.mainDomain === domain)!;
        date.sanDomains = "";
        date.created = "unknown";
        date.renew = "unknown";
        date.hasACME = false;
      })
      .then(() => setData(prev => prev.filter((row) => row.mainDomain !== domain || row.hasCertificate)))
      .catch(error => console.error(error));
  }

  function removeCertificate(domain: string) {
    cockpit.file(`etc/haproxy/certs/${domain}.pem`, {superuser: 'require'}).replace(null);
    const date = data.find(date => date.mainDomain === domain)!;
    date.hasCertificate = false;
    setData(prev => prev.filter((row) => row.mainDomain !== domain || row.hasACME));
  }

  const columnNames = {
    mainDomain: 'Main Domain',
    sanDomains: 'SAN-Domains',
    created: 'Created',
    renew: 'Renew',
    removeEntry: 'Remove Entry',
    removeCertificate: 'Remove Certificate'
  };

  const rows = data.map((acmeData) => { return {
    row:
      <Tr key={acmeData.mainDomain}>
          <Td dataLabel={columnNames.mainDomain}>
            {acmeData.mainDomain}
          </Td>
          <Td dataLabel={columnNames.sanDomains} modifier='breakWord'>
            {acmeData.sanDomains}
          </Td>
          <Td dataLabel={columnNames.created}>
            {acmeData.created}
          </Td>
          <Td dataLabel={columnNames.renew}>
            {acmeData.renew}
          </Td>
          <Td dataLabel={columnNames.removeEntry}>
            {acmeData.hasACME &&
              <ConfirmActionModal
                action={() => removeEntry(acmeData.mainDomain)}
                message={`Are you sure you want to delete the ACME entry for "${acmeData.mainDomain}"? This action is not reversible!`}
                buttonText='ACME'
                buttonIcon={<TrashIcon />} 
                variant='danger'
              />
            }
          </Td>
          <Td dataLabel={columnNames.removeCertificate}>
            {acmeData.hasCertificate &&
              <ConfirmActionModal
                action={() => removeCertificate(acmeData.mainDomain)}
                message={`Are you sure you want to delete the Certificate for "${acmeData.mainDomain}"? This action is not reversible!`}
                buttonText='Certificate'
                buttonIcon={<TrashIcon />}
                variant='danger'
              />
            }
          </Td>
      </Tr>,
    values: [acmeData.mainDomain, acmeData.sanDomains, acmeData.created, acmeData.renew, "", ""]
    }
  })

  const headerValues: HeaderValue[] = [
    {text: columnNames.mainDomain, sortable: true, filtrable: true},
    {text: columnNames.sanDomains, modifier:'breakWord'},
    {text: columnNames.created, sortable: true},
    {text: columnNames.renew, sortable: true},
    {screenReaderText: columnNames.removeEntry},
    {screenReaderText: columnNames.removeCertificate}
  ]

  return (
    <StandardTable
      headerValues={headerValues}
      rows={rows}
      ready={ready}
    />
  );
};
