import Handlebars from "handlebars";
import { collectionTemplate, reorderTemplate } from "../templates";

const templates = {
  "collection.hbs": collectionTemplate,
  "reorder.hbs": reorderTemplate,
};

function renderTemplate(templateName: keyof typeof templates, context: Record<string, unknown>): string {
  const templateSource = templates[templateName];
  
  if (!templateSource) {
    throw new Error(`Template "${templateName}" not found.`);
  }

  const compiled = Handlebars.compile(templateSource);
  return compiled(context);
}

export default renderTemplate;