import fs from 'fs';
import path from 'path';

export const getEmailTemplate = (templateName: string, variables: Map<string, string>) => {
    const templatePath = path.join(import.meta.dirname, '../../templates', `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf-8');
    variables.forEach((value, key) => {
        const regex = new RegExp(`\\$\\{${key}\\}`, "g");
        template = template.replace(regex, value);
    });
    return template;
}