import React from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
  FormHelperText,
  HelperText,
  HelperTextItem
} from '@patternfly/react-core';

export const AddDomainForm: React.FunctionComponent = () => {
  const [mainDomain, setMainDomain] = React.useState('');
  const [sanDomains, setSanDomains] = React.useState('');

  const handleMainDomainChange = (_event: React.FormEvent<HTMLInputElement>, mainDomain: string) => {
    setMainDomain(mainDomain);
  };

  const handleSanDomainsChange = (_event: React.FormEvent<HTMLInputElement>, sanDomains: string) => {
    setSanDomains(sanDomains);
  };

  return (
    <Form>
      <FormGroup
        label="Main Domain"
        fieldId="simple-form-mainDomain-01"
      >
        <TextInput
          type="url"
          id="simple-form-mainDomain-01"
          name="simple-form-mainDomain-01"
          value={mainDomain}
          onChange={handleMainDomainChange}
        />
      </FormGroup>
      <FormGroup
        label="SAN-Domains"
        fieldId="simple-form-sanDomains-01"
      >
        <TextInput
          type="url"
          id="simple-form-sanDomains-01"
          name="simple-form-sanDomains-01"
          value={sanDomains}
          onChange={handleSanDomainsChange}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem>Input an (optional) list of comma-separated SAN-Domains</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
      <ActionGroup>
        <Button variant="primary">Submit</Button>
        <Button variant="link">Cancel</Button>
      </ActionGroup>
    </Form>
  );
};
