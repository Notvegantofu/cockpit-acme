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
import cockpit from 'cockpit';

export const AddDomainForm: React.FunctionComponent = () => {
  const [mainDomain, setMainDomain] = React.useState('');
  const [sanDomains, setSanDomains] = React.useState('');

  const handleMainDomainChange = (_event: React.FormEvent<HTMLInputElement>, mainDomain: string) => {
    setMainDomain(mainDomain);
  };

  const handleSanDomainsChange = (_event: React.FormEvent<HTMLInputElement>, sanDomains: string) => {
    setSanDomains(sanDomains);
  };

  const commandBegin = ["sudo", "-u", "acme", "/usr/local/bin/acme.sh"];

  const getDomainList = () => {
      let result = ["-d", mainDomain];
      const sanDomainList = sanDomains.split(",");
      for (let domain of sanDomainList) {
        result.push("-d", domain.trim());
      }
      return result;
    };

  const addCertificate = () => {
    if (!mainDomain) {
      console.error("Main Domain Missing!");
      return;
    }
    const domains = getDomainList()
    cockpit.spawn(commandBegin.concat("--issue", domains, "--stateless", "--server", "letsencrypt"), {superuser: "require"})
      .then(() => cockpit.spawn(commandBegin.concat("--deploy", domains, "--deploy-hook", "haproxy", "DEPLOY_HAPROXY_PEM_PATH=/etc/haproxy/certs", "DEPLOY_HAPROXY_STATS_SOCKET=/var/lib/haproxy/stats", "DEPLOY_HAPROXY_HOT_UPDATE=yes"), {superuser: "require"}))
      .then(clearInput)
      .catch(error => console.error(error));
  }

  const clearInput = () => {
    setMainDomain("");
    setSanDomains("");
  }

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
        <Button variant="primary" onClick={addCertificate}>Add</Button>
        <Button variant="link" onClick={clearInput}>Cancel</Button>
      </ActionGroup>
    </Form>
  );
};
