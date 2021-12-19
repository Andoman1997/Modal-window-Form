import React, { useState, useEffect } from 'react';
import "./App.css";
import formConfig from "./formConfig.json";
import { v4 as uuid_v4 } from "uuid";
import 'antd/dist/antd.css'
import { Modal, Button } from 'antd';
import { Switch } from 'antd';
import { Input } from 'antd';


const { TextArea } = Input;

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
  const [totalPrice, setTotalPrice] = useState<any>(0);




  const onAdd100 = () => {
      setSwitchPrice1(!switchPrice1)
        if(!switchPrice1) {
          setTotalPrice(totalPrice + 100)
        } else {
          setTotalPrice(totalPrice - 100)
        }
  }

  const onAdd200 = () => {
    setSwitchPrice2(!switchPrice2)
      if(!switchPrice2) {
        setTotalPrice(totalPrice + 200)
      } else {
        setTotalPrice(totalPrice - 200)
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
    _formConfig.forEach(el => initialValidation[el.id] = true)
    setValidation(initialValidation)
  }, []);

  const validate = () => {
    let validation: any = {};

    _formConfig.forEach((el) => {
      const value: any = values[el.id];

      if (el.validation && el.validation.required && !value)
        validation[el.id] = false;
      else if (el.validation && el.validation.regexp) {
        const regexp = new RegExp(el.validation.regexp);
        const isValid = regexp.test(value);
        validation[el.id] = isValid;
      } else validation[el.id] = true;
    });

    return validation;
  };

  const formSubmit = () => {
    const validation = validate();
    setValidation(validation);
    console.log(validation);
    const hasErrors = Object.values(validation).includes(false);
    if (hasErrors) return;

    alert( "Form is valid" + "  " + Object.entries(validation));
  };

  const renderInput = (el: any) => {
    switch (el.type) {
      case "text":
        return (
          <input
            className={!validation[el.id] ? "invalid" : "" }
            key={el.id}
            type={el.type}
            placeholder={el.placeholder}
            value={values[el.name]}
            onChange={(e) => setValues({ ...values, [el.id]: e.target.value })}
          />
        );


      case "select":
        return (
           
          <label className='select-label'>Product type *: 
              <select 
                key={el.id}
                className={!validation[el.id] ? "invalid" : "" }
                onChange={(e) => setValues({ ...values, [el.id]: e.target.value })}
                 >
                {el.options.map((option: any, i: any) => (
                  <option key={i} value={values[el.id]}>
                    {option}
                    
                  </option>
                  
                ))}
              </select>
          </label>
              
        )      
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
         
         
          <label>Additional features for $100</label> <Switch  onChange={onAdd100}/>
          <label>Additional features for $200</label> <Switch  onChange={onAdd200} />
      

        <TextArea rows={4} placeholder="Type your comment" />

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
