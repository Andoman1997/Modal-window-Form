import React, { useState, useEffect } from 'react';
import "./App.css";
import formConfig from "./formConfig.json";
import { v4 as uuid_v4 } from "uuid";
import 'antd/dist/antd.css'
import { Modal, Button } from 'antd';
import { Switch } from 'antd';



interface FormConfigItem {
  id: string;
  type: string;
  name: string;
  options?: {
    label?: string;
    value?: number;
  };
  validation?: {
    required?: boolean;
    regexp?: string;
  };
}

// adding unique identifiers for each input to keep track in React
const _formConfig: FormConfigItem[] = formConfig.map((el:any) => ({
  ...el,
  id: uuid_v4(),
}));



function App() {
  const [values, setValues] = useState<any>({});
  const [validation, setValidation] = useState<any>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectPrice, setSelectPrice] = useState<any>(0);
  const [switchPrice1, setSwitchPrice1] = useState<any>(false);
  const [switchPrice2, setSwitchPrice2] = useState<any>(false);
  

  const totalPrice = selectPrice + switchPrice1 + switchPrice2


  


  const onChange100 = () => {
        if(!switchPrice1) {
          setSwitchPrice1(100)
        } else {
          setSwitchPrice1(0)
        }
  } 

  const onChange200 = () => {
      if(!switchPrice2) {
        setSwitchPrice2(200)
      } else {
        setSwitchPrice2(0)
      }
  }


  const showModal = () => {
    setIsModalVisible(true);
  };

  

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  

  useEffect(() => {
    let initialValidation: any = {}
    _formConfig.forEach(el => initialValidation[el.name] = true)
    setValidation(initialValidation)
  }, []);

  const validate = () => {
    let validation: any = {};

    _formConfig.forEach((el) => {
      const value: any = values[el.name];

      if (el.validation && el.validation.required && !value)
        validation[el.name] = false;
      else if (el.validation && el.validation.regexp) {
        const regexp = new RegExp(el.validation.regexp);
        const isValid = regexp.test(value);
        validation[el.name] = isValid;
      } else validation[el.name] = true;
    });

    return validation;
  };

  const formSubmit = () => {
    const validation = validate();
    console.log(values)
    setValidation(validation);
    const hasErrors = Object.values(validation).includes(false);
    if (hasErrors) return {
    };

  };

  const renderInput = (el: any) => {
    switch (el.type) {
      case "text":
        return (
          <input
            className={!validation[el.name] ? "invalid" : "" }
            key={el.id}
            type={el.type}
            placeholder={el.placeholder}
            value={values[el.name]}
            onChange={(e) => 
              setValues({ ...values, [el.name]: e.target.value })}
          />
        );


      case "select":
        return (
          <label className='select-label'>Product type *: 
              <select 
                key={el.id}
                className={!validation[el.name] ? "invalid" : "" }
                onChange={(e) => 
                  setSelectPrice(parseInt(e.target.value) )
                }
                 >
                {el.options.map((option: any, i: any) => (
                  <option key={i} value={option[1]}>
                    {option[0]}
                    
                  </option>
                  
                ))}
              </select>
          </label>  
       );

       case "checkbox":
        return (
          <label className='checkbox-label' >
            {el.label}
            <Switch
              key={el.id}
              checked={values[el.id]}
              onChange={(e) =>  {
                  el.name === 'switch1' ? onChange100() : onChange200()
                }
                
              }
            />
           
          </label>
        );
          case "comment":
            return (
              <input
                className={!validation[el.name] ? "invalid" : "" }
                key={el.id}
                type={el.type}
                placeholder={el.placeholder}
                value={values[el.name]}
                onChange={(e) => setValues({ ...values, [el.name]: e.target.value })}
              />
            );
    }
  };

  return (
    <div className="App">
      <form>
         <Button type="primary" onClick={showModal}>
        Open Form
      </Button>



      <Modal title="Title form" visible={isModalVisible}  onCancel={handleCancel} footer={null}>
         {_formConfig.map(renderInput)}
         
         
      


        <div className='total-price'>
          <span >Total price</span>
          <span>${totalPrice}</span>
        </div>

        <div className="submitBtn" onClick={() => formSubmit()}>Send form</div>
      </Modal>
       
      </form>
    </div>
  );
}

export default App;
