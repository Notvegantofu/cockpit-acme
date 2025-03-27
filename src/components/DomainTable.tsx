import React from 'react';
import { Tr, Td } from '@patternfly/react-table';
import { StandardTable, HeaderValue } from 'shared/StandardTable'
import { ConfirmActionModal } from 'shared/ConfirmActionModal'
import cockpit from 'cockpit';
import { devMode } from '../app'

export interface AcmeData {
  mainDomain: string;
  sanDomains: string;
  created: string;
  renew: string;
}

interface TableProps {
  dataState: [AcmeData[], React.Dispatch<React.SetStateAction<AcmeData[]>>];
  ready: boolean;
}

export const DomainTable: React.FunctionComponent<TableProps> = ({ dataState: [ data, setData ], ready }) => {

  function removeCertificate(domain: string) {
    if (devMode) {
      setData(data.filter((row) => row.mainDomain !== domain));
      return;
    }
    cockpit.spawn(["sudo", "-u", "acme", "/usr/local/bin/acme.sh", "--remove", "-d", domain], {superuser: 'require'})
      .then(() => setData(data.filter((row) => row.mainDomain !== domain)))
      .catch(error => console.error(error));
  }

  const columnNames = {
    mainDomain: 'Main Domain',
    sanDomains: 'SAN-Domains',
    created: 'Created',
    renew: 'Renew',
    remove: 'Remove'
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
          <Td dataLabel={columnNames.remove}>
            <ConfirmActionModal
              action={() => removeCertificate(acmeData.mainDomain)}
              message={`Are you sure you want to delete the ACME certificate for "${acmeData.mainDomain}"? This action is not reversible!`}
              buttonText='Delete'
              variant='danger'
            />
          </Td>
      </Tr>,
    values: [acmeData.mainDomain, acmeData.sanDomains, acmeData.created, acmeData.renew, ""]
    }
  })

  const headerValues: HeaderValue[] = [
    {text: columnNames.mainDomain, sortable: true, filtrable: true, width: 15},
    {text: columnNames.sanDomains, modifier:'breakWord', width: 45},
    {text: columnNames.created, sortable: true, width: 15},
    {text: columnNames.renew, sortable: true, width: 15},
    {screenReaderText: columnNames.remove, width: 10}
  ]

  return (
    <StandardTable
      headerValues={headerValues}
      rows={rows}
      ready={ready}
    />
  );
};
