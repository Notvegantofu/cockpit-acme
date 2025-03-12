import React, { useEffect, useState } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { Button, Bullseye, EmptyState, EmptyStateVariant, EmptyStateIcon, EmptyStateHeader} from '@patternfly/react-core'
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { ConfirmDeletion } from './ConfirmDeletion.js';
import sampleData from './sampleData.js'
import cockpit from 'cockpit';

interface AcmeData {
  mainDomain: string;
  sanDomains: string | null;
  created: string | null;
  renew: string;
}

export const DomainTable: React.FunctionComponent = () => {

  const DataRows: React.FunctionComponent = () => {
    return (
      <>
        {rows.map((acmeData) => (
        <Tr key={acmeData.mainDomain}>
            <Td dataLabel={columnNames.mainDomain}>{acmeData.mainDomain}</Td>
            <Td dataLabel={columnNames.sanDomains}>{acmeData.sanDomains}</Td>
            <Td dataLabel={columnNames.created}>{acmeData.created}</Td>
            <Td dataLabel={columnNames.renew}>{acmeData.renew}</Td>
            <Td dataLabel={columnNames.remove}>{<ConfirmDeletion removeRow={removeCertificate} domain={acmeData.mainDomain}/>}</Td>
        </Tr>
        ))}
      </>)
  }

  const MissingData: React.FunctionComponent = () => {
    return (
      <Tr>
        <Td colSpan={8}>
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.sm}>
              <EmptyStateHeader
                icon={<EmptyStateIcon icon={SearchIcon} />}
                titleText="No results found"
                headingLevel="h2"
              />
            </EmptyState>
          </Bullseye>
        </Td>
      </Tr>
    )
  }

  const processData = (data: string) => {
    if (!data) {
      console.error("No data");
      const noData: AcmeData = { mainDomain: "missing", sanDomains: "missing", created: "missing", renew: "missing"};
      return [noData];
    }
    const lines = data.split('\n');
    lines.shift();
    return lines.map((value) => {
      const [ mainDomain, keyLength, sanDomains, caches, created, renew ] = value.split("|");
      const acmeData: AcmeData = { mainDomain: mainDomain, sanDomains: sanDomains, created: created, renew: renew};
      return acmeData;
    })
  }

  const getCertificateList = () => {
    return cockpit.spawn(["sudo", "-u", "acme", "/usr/local/bin/acme.sh", "--list", "--listraw"]);
  }

  const [rows, setRows] = useState<AcmeData[]>(processData(""));
  const [status, setStatus] = useState(false)

  useEffect(() => {
    getCertificateList()
      .then(result => setRows(processData(result)))
      .then(() => setStatus(true))
      .catch(error => console.error(error));
  }, []);

  const removeRow = (domain: string) => {
    setRows(rows.filter((row) => row.mainDomain !== domain));
  }

  const removeCertificate = (domain: string) => {
    cockpit.spawn(["sudo", "-u", "acme", "/usr/local/bin/acme.sh", "--remove", "-d", domain])
      .then(() => removeRow(domain))
      .catch(error => console.error(error));
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
        {status ? <DataRows/> : <MissingData/>}
    </Tbody>
    </Table>
  );
};
