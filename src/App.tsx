import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.css";
import { useState, useEffect } from "react";

// components
import SectionTitle from "./components/SectionTitle";
import Container from "./components/Container";
import Connector from "./components/Connector";
import Footer from "./components/Footer";
import FormConnector from "./components/FormConnector";

// utilities
import NavigationButton from "./utilities/NavigationButton";
import BackButton from "./utilities/BackButton";

// Define the FormElement interface to represent form elements
interface FormElement {
    name?: string; // Optional name of the form element
    type: string; // Type of the form element
    element?: { [key: string]: any }; // Additional element properties
    textContent?: string; // Text content of the form element
    getChildren?: () => Promise<FormElement[]>; // Function to get children of the form element
    getAllCustomAttributes?: () => Promise<FormElement[]>; // Function to get all custom attributes of the form element
    getTag?: () => Promise<FormElement[]>;
    attributes?: any[]; // Ensure 'attributes' property is present
}

// Define the CustomField interface to represent custom fields
interface CustomField {
    name: string | undefined; // Name of the webflow field
    element?: any; // Define field element property
    Attr: { name: string, value: any }[]; // Array of attributes for the field
}


// Define the initial state values for the App component
const initialFieldArr: FormElement[] = []; // Initial array of form elements
const initialActivePage = "Connector"; // Initial active page
const initialFormIsSelected = "NotForm"; // Initial form selection state

const App = () => {
    // State variables
    const [activePage, setActivePage] = useState(initialActivePage); // State for active page
    const [formIsSelected, setFormIsSelected] = useState(initialFormIsSelected); // State for form selection
    const [fieldArr, setFieldArr] = useState<FormElement[]>(initialFieldArr); // State for array of form elements
    const [inputValue, setInputValue] = useState('');
    const [formConnectionAttributes, setFormConnectionAttributes] = useState<FormElement[]>(initialFieldArr); // State for array of form elements

    // Function to handle input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };

    // Function to handle button click for single object
    const handleSingleObjectButtonClick = async () => {
      // Create new style
      const hidden = await webflow.createStyle("Hidden field for " + inputValue);
      await hidden.setProperty("display", "none")

      const el = await getSelectedElement(); // Get selected element
      if (el && el.type === "FormForm") { // Check if element is a form
          el.setCustomAttribute("data-sf-form-connection", "Lead-acc"); // set Connection Name
          el.setCustomAttribute("data-sf-object", "Lead"); // set custom attribute based on selected object
          fieldArr.forEach((field) =>{
            const fieldEl = field.element
            fieldEl?.setCustomAttribute('data-sf-field', field?.name)
          })

           // Add custom dom element with predefined value
          const newDiv = await el.append(webflow.elementPresets.DivBlock);
          const newLabel = await newDiv.append(webflow.elementPresets.FormBlockLabel)
          const newInput = await newDiv.append(webflow.elementPresets.DOM)

          newDiv.setStyles([hidden])
          newLabel.setTextContent('Company')
          newInput.setAttribute('value',inputValue)
          newInput.setTag('input')
          newInput.setAttribute('type','text')
          newInput.setAttribute('data-sf-field','Custom')
      }
    };

    // Function to handle button click for reference object
    const handleRefObjectButtonClick = async () => {
      // Create new style
      const hidden = await webflow.createStyle("Hidden field for " + inputValue);
      await hidden.setProperty("display", "none")

      const el = await getSelectedElement(); // Get selected element
      if (el && el.type === "FormForm") { // Check if element is a form
          el.setCustomAttribute("data-sf-form-connection", "Lead-acc"); // set Connection Name
          el.setCustomAttribute("data-sf-object", "Lead"); // Set custom attribute based on selected object
          el.setCustomAttribute("data-sf-ref-object", "Account"); // Set reference object attribute
          el.setCustomAttribute("data-sf-optional", "false"); // Set optional attribute
          el.setCustomAttribute("data-sf-rel-type", "master-detail"); // Set relationship type attribute
          fieldArr.forEach((field) =>{ // loop through each field
            const fieldEl = field.element
            if(field.type === "DOM"){
              fieldEl?.setAttribute('data-sf-field', field?.name)  // Set salesforce field custom attribute
              fieldEl?.setAttribute('data-sf-ref-field', field?.name)  // Set salesforce field custom attribute for reference object field
            }else{
              fieldEl?.setCustomAttribute('data-sf-field', field?.name)  // Set salesforce field custom attribute
              fieldEl?.setCustomAttribute('data-sf-ref-field', field?.name)  // Set salesforce field custom attribute for reference object field
            }
          })
          
          // Add custom dom element with predefined value
          const newDiv = await el.append(webflow.elementPresets.DivBlock);
          const newLabel = await newDiv.append(webflow.elementPresets.FormBlockLabel)
          const newInput = await newDiv.append(webflow.elementPresets.DOM)
          const parentDivEl:any = newDiv.id

          await newDiv.setStyles([hidden])
          await newLabel.setTextContent('Company')
          await newInput.setAttribute('value',inputValue)
          await newInput.setTag('input')
          await newInput.setAttribute('type','text')
          await newInput.setAttribute('data-sf-field','Custom SF field')
          await newInput.setAttribute('data-sf-parentEl',parentDivEl.element)
          getSelectedElement()
      }
    };

    // Function to delete the whole connection
    const handleDeleteConnectionButtonClick = async () =>{
      const allEl = await webflow.getAllElements()
      formConnectionAttributes.forEach((connectionArr) => { // Iterate through formConnectionAttributes
        const attributes = connectionArr.attributes; // Get attributes array from each connection
        if(connectionArr.type === "Form Attr"){
          attributes?.forEach((x:any) =>{
            x.element.removeCustomAttribute(x.name)
          })
        }else{
          attributes?.forEach((x) =>{
            x.Attr.forEach(async (y:any) =>{
              if(y.type === "DOM"){
                if(y.name === "data-sf-parentEl"){
                  const hiddenDiv:string = y.value
                  const parentEl:any = allEl.filter(i => {
                    const parentDivEl:any = i.id
                    return parentDivEl.element === hiddenDiv
                  })[0]
                  await parentEl.remove()
                }
              }else{
                y.element.removeCustomAttribute(y.name)                  
              }
            })
          })
        }
      });
    }

    // Fetch data on application load
    useEffect(() => {
        const fetchAppData = async () => {
            try {
                // Code for fetching site info, pages, and switching pages can be added here
            } catch (error) {
                console.error("Error fetching site info:", error);
            }
        };

        // Call the function immediately
        fetchAppData();
        return () => {}; // Cleanup function
    }, []);

    // Subscribe to selected element changes
    useEffect(() => {
        webflow.subscribe("selectedelement", getSelectedElement); // Subscribe to selected element
    }, []);

    // Function to get existing custom attribute that will be used to populate existing form connector 
    const getSelectedElement = async () => {
        const el = await webflow.getSelectedElement(); // Get selected element
        console.log(el)
        if (el?.type === "FormForm" && el.getChildren && el.getAllCustomAttributes) { // Check if element is a form and has children
            const formChildren = await el.getChildren(); // Get children of the form
            const newFieldArr: FormElement[] = []; // Initialize array for new form elements
            for (const child of formChildren) {
                await getFormTextInputsRecursive(child, newFieldArr, formChildren); // Recursive function to get form elements
            }
            setFieldArr(newFieldArr); // Set new field array
            setFormIsSelected("FormForm"); // Set form selection state

            const formCustomAttrAll: { name: string, value: any }[] = await el.getAllCustomAttributes(); // Get all custom attributes
            const formCustomAttr = formCustomAttrAll.filter(attr => attr.name.toLowerCase().includes('-sf-')); // only target custom attribute related to Salesforce
            const sfFormCustomAttr: { name: string, value: any, element:{} }[] = [] 
            formCustomAttr.forEach((x)=>{
              sfFormCustomAttr.push({ name: x.name, value: x.value, element: el });
            })
            const fieldCustomAttr: CustomField[] = []; // Initialize array for field custom attributes

            newFieldArr.forEach(async (field) => { // Loop through new fields
              const fieldEl = field.element; // Get field element
              const fieldType = field.type; // Get field type
              const individualFieldAttr: { name: string, value: any, element: any, type: string }[] = []; // Initialize array for individual field attributes
              if (fieldEl) { // Check if fieldEl is defined
                  const fieldCustomAttributesAll: { name: string, value: any }[] = fieldType === "DOM" ? await fieldEl.getAllAttributes() :await fieldEl.getAllCustomAttributes(); // Get all custom attributes
                  const fieldCustomAttributes = fieldCustomAttributesAll.filter((attr:any) => attr.name.toLowerCase().includes('-sf-')); // only target custom attribute related to Salesforce
                  if (fieldCustomAttributes) {
                      fieldCustomAttributes.forEach((x:any) => {
                          individualFieldAttr.push({ name: x.name, value: x.value, element: fieldEl, type: fieldType }); // Push individual attribute to array
                      });
                  }
              }
              fieldCustomAttr.push({ name: field.name, 'Attr': individualFieldAttr }); // Push custom attribute to array
            });

            const structuredAttributes = [ // Create structured attributes array
                { type: 'Form Attr', attributes: sfFormCustomAttr }, // Form attributes
                { type: 'Field Attr', attributes: fieldCustomAttr } // Field attributes
            ];

            setFormConnectionAttributes(structuredAttributes)
            console.log('Existing custom attributes', structuredAttributes); // Log existing custom attributes

            return el; // Return selected element
        } else {
            setFormIsSelected("NotForm"); // Set form selection state to NotForm
            return null; // Return null
        }
    };

    // Recursive function to get form text label
    async function getFormTextInputsRecursive(
        el: FormElement,
        fieldArr: FormElement[],
        formChildren: FormElement[]
    ): Promise<void> {
        // Add type of inputs here
        const inputTypes = ["FormTextInput","DOM","FormTextArea","FormRadioInput","FormCheckboxInput"]
        if (inputTypes.includes(el.type)) {
            let formName = "";
            // Find the corresponding label for the text input
            const labelElement:any = formChildren.find(
                (sibling) => (sibling.type === "FormBlockLabel" || "FormInlineLabel") && sibling.textContent
            );

            if (labelElement) {
                // Extract the text content from the label's children
                const children =  await labelElement.getChildren();
                if (children.length > 0) {
                    formName = await children[0].getText();
                }
            }

            // Create a FormElement object for the text input and add it to the field array
            const formInputObject: FormElement = {
                name: formName || "",
                type: el.type,
                element: el
            };
            fieldArr.push(formInputObject);
        }

        // Recursively process child elements if the current element has children
        if (el.getChildren) {
            const children = await el.getChildren();
            for (const child of children) {
                await getFormTextInputsRecursive(child, fieldArr, children);
            }
        }
    }

    return (
    <div className="overflow-hidden h-100">
      {activePage === "Title" && (
        <SectionTitle onClickItem={setActivePage}></SectionTitle>
      )}

      {activePage === "Nav" && (
        <Container>
          <NavigationButton
            navType="Connector"
            img="Library.svg"
            onNavClick={setActivePage}
          >
            Map Webflow form to Salesforce form
          </NavigationButton>

          <NavigationButton
            navType="ConnectedForms"
            img="Flows.svg"
            onNavClick={setActivePage}
          >
            Connected Forms (2)
          </NavigationButton>

          <NavigationButton
            navType="Log"
            img="WarningCircle.svg"
            onNavClick={setActivePage}
          >
            Failed Form Submission Log
          </NavigationButton>

          <NavigationButton
            navType="Notification"
            img="Updates.svg"
            onNavClick={setActivePage}
          >
            Notification Settings
          </NavigationButton>

          <NavigationButton
            navType="Advance"
            img="Settings.svg"
            onNavClick={setActivePage}
          >
            Advanced Settings
          </NavigationButton>

          <Footer>
            <button
              type="button"
              className="btn btn-outline-secondary text-white w-100"
            >
              Go to app page to uninstall app and reauthenticate
            </button>
          </Footer>
        </Container>
      )}

      {activePage === "Connector" && (
        <Container>
          <BackButton navType="Nav" onBtnClick={setActivePage} />
          {formIsSelected === "NotForm" && <Connector />}
          {formIsSelected === "FormForm" && <FormConnector inputValue={inputValue} onInputChange={handleInputChange} singleObjectButtonClick={handleSingleObjectButtonClick} refObjectButtonClick={handleRefObjectButtonClick} deleteConnectionButtonClick={handleDeleteConnectionButtonClick} />}
        </Container>
      )}
    </div>
  );
};

export default App;
