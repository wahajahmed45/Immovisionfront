'use client'
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getAgentsEmails } from '@/services/user/UserServices';

interface AgentSelectorProps {
  onAgentSelect: (email: string) => void;
  className?: string;
  placeholderEmail?: string; 
}

interface OptionType {
  value: string;
  label: string;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ onAgentSelect, className, placeholderEmail }) => {
  const [agents, setAgents] = useState<OptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setIsLoading(true);
    const agentEmails = await getAgentsEmails();
    const options = agentEmails.map(email => ({
      value: email,
      label: email
    }));
    setAgents(options);
    setIsLoading(false);
  };

  
  const placeholderOption = placeholderEmail
    ? agents.find(agent => agent.value === placeholderEmail)
    : null;

  return (
    <div className={className}>
      <Select
        options={agents}
        isLoading={isLoading}
        isClearable
        isSearchable
        placeholder="Select agent..."
        onChange={(option) => {
          if (option) {
            onAgentSelect(option.value);
          } else {
            onAgentSelect('');
          }
        }}
        value={placeholderOption || null} // Set value to placeholderOption if provided
        classNames={{
          control: () => 'p-1',
          menu: () => 'mt-1'
        }}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#2563eb',
            primary25: '#eff6ff',
            primary50: '#dbeafe',
            primary75: '#bfdbfe'
          }
        })}
      />
    </div>
  );
};

export default AgentSelector;