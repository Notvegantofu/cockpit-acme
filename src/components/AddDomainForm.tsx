import React, { useState } from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
  FormHelperText,
  HelperText,
  HelperTextItem,
  CodeBlockCode,
  CodeBlock
} from '@patternfly/react-core';
import cockpit from 'cockpit';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { devMode } from '../app';

export const AddDomainForm: React.FunctionComponent = () => {
  const [mainDomain, setMainDomain] = useState('');
  const [sanDomains, setSanDomains] = useState('');
  const [validInput, setValidInput] = useState(true);
  const [output, setOutput] = useState('');
  const sudoAcme = ["sudo", "-u", "acme", "/usr/local/bin/acme.sh"];
  const envVariables = ["DEPLOY_HAPROXY_HOT_UPDATE=yes", "\\", "DEPLOY_HAPROXY_STATS_SOCKET=/var/lib/haproxy/stats", "\\", "DEPLOY_HAPROXY_PEM_PATH=/etc/haproxy/certs", "\\"];

  function handleMainDomainChange(_event: React.FormEvent<HTMLInputElement>, mainDomain: string) {
    setMainDomain(mainDomain);
    setValidInput(true);
  };

  function handleSanDomainsChange(_event: React.FormEvent<HTMLInputElement>, sanDomains: string) {
    setSanDomains(sanDomains);
  };

  function getDomainList() {
      let result = ["-d", mainDomain];
      const sanDomainList = sanDomains.split(",");
      for (let domain of sanDomainList) {
        result.push("-d", domain.trim());
      }
      return result;
    };

  function addCertificate() {
    if (!mainDomain) {
      console.error("Main Domain Missing!");
      setValidInput(false);
      return;
    }
    const domains = getDomainList();
    const firstCommand = sudoAcme.concat("--issue", domains, "--force", "--stateless", "--server", "letsencrypt");
    const secondCommand = envVariables.concat(sudoAcme, "--deploy", domains, "--deploy-hook", "haproxy");
    if (devMode) {
      console.log(`Executing commands:
        ${firstCommand}
        ${secondCommand}`);
        clearInput();
        return;
    }
    setOutput(firstCommand.reduce((prev, curr) => prev + curr));
    cockpit.spawn(firstCommand, {superuser: "require"})
      .stream((commandOutput) => setOutput(output+commandOutput))
      .then(() => setOutput(secondCommand.reduce((prev, curr) => prev + curr)))
      .then(() => cockpit.spawn(secondCommand, {superuser: "require"})
      .stream((commandOutput) => setOutput(output+commandOutput)))
      .then(clearInput)
      .catch(error => console.error(error));
  }

  function clearInput() {
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
        <FormHelperText>
          <HelperText>
            {validInput || <HelperTextItem icon={<ExclamationCircleIcon/>} variant='error'>This field is required</HelperTextItem>}
          </HelperText>
        </FormHelperText>
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
      <CodeBlock>
        <CodeBlockCode>{output}</CodeBlockCode>
      </CodeBlock>
    </Form>
  );
};
