import React, { useState } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { Button, ButtonProps } from '@patternfly/react-core'
import { ConfirmDeletion } from './ConfirmDeletion.js';
import sampleData from './sampleData.js'

interface AcmeData {
  mainDomain: string;
  sanDomains: string | null;
  created: string | null;
  renew: string;
}

export const DomainTable: React.FunctionComponent = () => {

  const processData = (data: string) => {
    const lines = data.split('\n');
    lines.shift();
    return lines.map((value) => {
      const [ mainDomain, keyLength, sanDomains, caches, created, renew ] = value.split("|");
      const acmeData: AcmeData = { mainDomain: mainDomain, sanDomains: sanDomains, created: created, renew: renew};
      return acmeData;
    })
  }

  const [rows, setRows] = useState<AcmeData[]>(processData(sampleData));

  const removeRow = (domain: string) => {
    setRows(rows.filter((row) => row.mainDomain !== domain));
  }

  const removeCertificate = (domain: string) => {
    console.log(domain);
    removeRow(domain);
  }

  const columnNames = {
    mainDomain: 'Main Domain',
    sanDomains: 'SAN-Domains',
    created: 'Created',
    renew: 'Renew',
    remove: 'Remove'
  };

  return (
    <Table
    aria-label="ACME table"
    variant='compact'
    >
    <Thead>
        <Tr>
        <Th>{columnNames.mainDomain}</Th>
        <Th>{columnNames.sanDomains}</Th>
        <Th>{columnNames.created}</Th>
        <Th>{columnNames.renew}</Th>
        <Th></Th>
        </Tr>
    </Thead>
    <Tbody>
        {rows.map((acmeData) => (
        <Tr key={acmeData.mainDomain}>
            <Td dataLabel={columnNames.mainDomain}>{acmeData.mainDomain}</Td>
            <Td dataLabel={columnNames.sanDomains}>{acmeData.sanDomains}</Td>
            <Td dataLabel={columnNames.created}>{acmeData.created}</Td>
            <Td dataLabel={columnNames.renew}>{acmeData.renew}</Td>
            <Td dataLabel={columnNames.remove}>{<ConfirmDeletion removeRow={removeCertificate} domain={acmeData.mainDomain}/>}</Td>
        </Tr>
        ))}
    </Tbody>
    </Table>
  );
};
