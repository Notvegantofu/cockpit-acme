import React, { useEffect, useState } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { Bullseye, EmptyState, EmptyStateVariant, EmptyStateIcon, EmptyStateHeader, SearchInput} from '@patternfly/react-core'
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { ConfirmDeletion } from './ConfirmDeletion.js';
import sampleData from './sampleData.js'
import cockpit from 'cockpit';

interface AcmeData {
  mainDomain: string;
  sanDomains: string;
  created: string;
  renew: string;
}

export const DomainTable: React.FunctionComponent = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [rows, setRows] = useState<AcmeData[]>(processData(""));
  const filteredRows = rows.filter(onFilter);

  useEffect(() => {
    getCertificateList()
      .then(result => setRows(processData(result)))
      .catch(error => console.error(error));
  }, []);

  const DataRows: React.FunctionComponent = () => {
    return (
      <>
        {filteredRows.length === 0 ? <MissingData/> : filteredRows.map((acmeData) => (
          <Tr key={acmeData.mainDomain}>
              <Td dataLabel={columnNames.mainDomain}>{acmeData.mainDomain}</Td>
              <Td dataLabel={columnNames.sanDomains}>{acmeData.sanDomains}</Td>
              <Td dataLabel={columnNames.created}>{acmeData.created}</Td>
              <Td dataLabel={columnNames.renew}>{acmeData.renew}</Td>
              <Td dataLabel={columnNames.remove}>{<ConfirmDeletion removeCertificate={removeCertificate} domain={acmeData.mainDomain}/>}</Td>
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

  function processData(data: string) {
    if (!data) {
      console.error("No data");
      return [];
    }
    const lines = data.split('\n');
    lines.shift();
    return lines.map((value) => {
      const [ mainDomain, keyLength, sanDomains, caches, created, renew ] = value.split("|");
      const acmeData: AcmeData = { mainDomain: mainDomain, sanDomains: sanDomains, created: created, renew: renew};
      return acmeData;
    })
  }

  function getCertificateList() {
    return cockpit.spawn(["sudo", "-u", "acme", "/usr/local/bin/acme.sh", "--list", "--listraw"]);
  }

  function onSearchChange(value: string) {
    setSearchValue(value);
  };

  function onFilter(row: AcmeData) {
    if (searchValue === '') {
      return true;
    }

    let input: RegExp;
    try {
      input = new RegExp(searchValue, 'i');
    } catch (err) {
      input = new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }
    return row.mainDomain.search(input) >= 0;
  };

  function removeCertificate(domain: string) {
    cockpit.spawn(["sudo", "-u", "acme", "/usr/local/bin/acme.sh", "--remove", "-d", domain])
      .then(() => setRows(rows.filter((row) => row.mainDomain !== domain)))
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
    <>
    <SearchInput
      placeholder="Filter by main domain"
      value={searchValue}
      onChange={(_event, value) => onSearchChange(value)}
      onClear={() => onSearchChange('')}
    />
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
      <DataRows/>
    </Tbody>
    </Table>
    </>
  );
};
