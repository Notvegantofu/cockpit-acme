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

import React, { useState } from 'react';
import { HorizontalNav } from './components/HorizontalNav';
import { DomainTable, AcmeData } from './components/DomainTable';
import { AddDomainForm } from './components/AddDomainForm'
import { Divider, Stack, StackItem } from '@patternfly/react-core';


export const Application = () => {
    const [content, setContent] = useState(0);
      const [rows, setRows] = useState<AcmeData[]>([]);

    const actions= [
      <DomainTable rows={rows} setRows={setRows}/>,
      <AddDomainForm/>
    ]

    return (
        <>
            <HorizontalNav setAction={setContent}/>
            <Divider/>
            {actions[content]}
        </>
    );
};
