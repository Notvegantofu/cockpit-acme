import React, { useEffect, useState } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { Bullseye, EmptyState, EmptyStateVariant, EmptyStateIcon, EmptyStateHeader, SearchInput, Spinner} from '@patternfly/react-core'
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { ConfirmDeletion } from './ConfirmDeletion.js';
import sampleData from './sampleData.js'
import cockpit from 'cockpit';

export interface AcmeData {
  mainDomain: string;
  sanDomains: string;
  created: string;
  renew: string;
}

interface TableProps {
  rows: AcmeData[];
  setRows: React.Dispatch<React.SetStateAction<AcmeData[]>>
}

export const DomainTable: React.FunctionComponent<TableProps> = ({ rows, setRows }) => {
  const [searchValue, setSearchValue] = useState('');
  const [ready, setReady] = useState(false);
  const [activeSortIndex, setActiveSortIndex] = useState(0);
  const [activeSortDirection, setActiveSortDirection] = useState<'asc'|'desc'>('asc');
  const filteredRows = rows.filter(onFilter);
  const devMode = false;

  useEffect(() => {
    getCertificateList()
      .then(result => setRows(processData(result)))
      .then(() => setReady(true))
      .catch(error => console.error(error));
  }, []);

  function processData(data: string) {
    if (!data) {
      console.error("No data");
      return [];
    }
    let lines = data.split('\n');
    lines.shift();
    lines = lines.filter(value => value !== "");
    return lines.map((value) => {
      const [ mainDomain, keyLength, sanDomains, caches, created, renew ] = value.split("|");
      const acmeData: AcmeData = { mainDomain: mainDomain, sanDomains: sanDomains, created: created, renew: renew};
      return acmeData;
    })
  }

  function getCertificateList() {
    if (devMode) {
      return new Promise<string>((resolve) => setTimeout(() => resolve(sampleData), 1000));
    }
    return cockpit.spawn(["sudo", "-u", "acme", "/usr/local/bin/acme.sh", "--list", "--listraw"], {superuser: 'require'});
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
    if (devMode) {
      setRows(rows.filter((row) => row.mainDomain !== domain));
      return;
    }
    cockpit.spawn(["sudo", "-u", "acme", "/usr/local/bin/acme.sh", "--remove", "-d", domain], {superuser: 'require'})
      .then(() => setRows(rows.filter((row) => row.mainDomain !== domain)))
      .catch(error => console.error(error));
  }

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc' // starting sort direction when first sorting a column. Defaults to 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });

  const columnNames = {
    mainDomain: 'Main Domain',
    sanDomains: 'SAN-Domains',
    created: 'Created',
    renew: 'Renew',
    remove: 'Remove'
  };

  const getSortableRowValues = (data: AcmeData): (string | number)[] => {
    const { mainDomain, sanDomains, created, renew } = data;
    return [mainDomain, sanDomains, created, renew];
  };

  
  let sortedData = filteredRows.sort((a, b) => {
    const aValue = getSortableRowValues(a)[activeSortIndex];
    const bValue = getSortableRowValues(b)[activeSortIndex];
    if (activeSortDirection === 'asc') {
      return (aValue as string).localeCompare(bValue as string);
    }
    return (bValue as string).localeCompare(aValue as string);
  });

  const DataRows: React.FunctionComponent = () => {
    return (
      <>
        {!ready? <LoadingData/> :
        filteredRows.length === 0 ? <MissingData/> : filteredRows.map((acmeData) => (
          <Tr key={acmeData.mainDomain}>
              <Td dataLabel={columnNames.mainDomain}>{acmeData.mainDomain}</Td>
              <Td dataLabel={columnNames.sanDomains} modifier='breakWord'>{acmeData.sanDomains}</Td>
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
        <Td colSpan={5}>
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

  const LoadingData: React.FunctionComponent = () => {
    return (
      <Tr>
        <Td colSpan={3}>
          <Bullseye>
            <Spinner/>
          </Bullseye>
        </Td>
      </Tr>
    )
  }

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
        <Th width={15} sort={getSortParams(0)}>{columnNames.mainDomain}</Th>
        <Th width={45} modifier='breakWord'>{columnNames.sanDomains}</Th>
        <Th width={15} sort={getSortParams(2)}>{columnNames.created}</Th>
        <Th width={15} sort={getSortParams(3)}>{columnNames.renew}</Th>
        <Th width={10}></Th>
      </Tr>
    </Thead>
    <Tbody>
      <DataRows/>
    </Tbody>
    </Table>
    </>
  );
};
