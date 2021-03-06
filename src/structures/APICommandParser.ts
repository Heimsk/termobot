import { BaseCommand } from './BaseCommand';

export interface APICommandOptionsChoices {
  name: string;
  value: string | number
}

export interface APICommandOptions {
  name: string;
  description: string;
  type: number;
  required?: boolean;
  channel_types?: any;
  min_value?: number;
  max_value?: number;
  choices?: Array<APICommandOptionsChoices>;
}

export interface APICommand {
  id?: string
  name: string;
  description: string;
  type: number;
  default_member_permissions: string | null;
  options?: Array<APICommandOptions>;
}

export function APICommandParser(command: BaseCommand): any {
  if(!command) throw Error('Command is missing');
  
  let parsed: APICommand = {
    name: '',
    description: '',
    type: 1,
    default_member_permissions: null
  }
  
  if(command.infos) {
    if(command.infos.name) {
      parsed.name = command.infos.name;
    }
    
    if(command.infos.description) {
      parsed.description = command.infos.description;
    } else {
      parsed.description = 'Não definido';
    }
    
    if(command.infos.type) {
      parsed.type = command.infos.type;
    }
  }
  
  if(command.options && command.options.length > 0) {
    for(let ioption of command.options) {
      let option: APICommandOptions = {
        name: ioption.name,
        description: ioption.description || 'Não definido',
        type: ioption.type || 3
      }
      
      if(ioption.required) {
        option.required = ioption.required
      }
      
      if(ioption.channel_types) {
        option.channel_types = ioption.channel_types;
      }
      
      if(ioption.min_value) {
        option.min_value = ioption.min_value;
      }
      
      if(ioption.max_value) {
        option.max_value = ioption.max_value;
      }
      
      if(ioption.choices && ioption.choices.length > 0) {
        for(let ichoice of ioption.choices) {
          if(!ichoice.name) throw Error('Missing choice name');
          if(typeof ichoice.value == undefined || typeof ichoice.value == null) throw Error('Missing choice value');
          
          let choice: APICommandOptionsChoices = {
            name: ichoice.name,
            value: ichoice.value
          }
          
          if(!option.choices) option.choices = [];
          option.choices.push(choice);
        }
      }
      
      if(!parsed.options) parsed.options = [];
      parsed.options.push(option);
    }
  }
  
  if(command.requirements) {
    if(command.requirements.default_member_permissions) parsed.default_member_permissions = command.requirements.default_member_permissions;
  }
  
  return parsed;
}