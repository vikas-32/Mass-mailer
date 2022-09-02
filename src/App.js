import React,{ useState } from "react";
import Papa from "papaparse";
import validator from "validator";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import axios from 'axios';

function App() {// State to store parsed data
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  function handleChange(event) {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  }
  const [parsedData, setParsedData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //State to store the values
  const [values, setValues] = useState([]);

  // Invalid Emails
  const [invalidEmails, setInvalidEmails] = useState([]);
  const [validEmails, setValidEmails] = useState([]);
  const [isinvalidEmails, setIsinvalidEmails] = useState(false);
  const [isvalidEmails, setIsvalidEmails] = useState(false);


  const [msg,setMsg] = useState('');
  const [user, setUser] = useState({
    from: "",
    pass: "",
    subject: "",
    description: ""
  });

  
  const onInputChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  
  
  const onSubmit = async e => {
    const formData = new FormData();
    e.preventDefault();
    formData.append("file", file);
    formData.append("user", JSON.stringify(user));
    formData.append("mailist", JSON.stringify(validEmails));
    await axios.post("http://localhost:5000/users/", formData)
   .then(response => setMsg(response.data.respMesg));
  };


  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        //console.log(results.data);
        const rowsArray = [];
        const valuesArray = [];
        
        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });
        // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setValues(valuesArray);
      },
    });
  };

  const validatoremail=(event)=>{
    const validemail=[];
    values.map((value, index) => {
      return (
            value.map((val, i) => {
            if(validator.isEmail(val)){
              validemail.push(val);
            }
          })
      );
    })
    setValidEmails(validemail);
    setIsvalidEmails(true);
    setIsinvalidEmails(false);
    //setInvalidEmails([]);
  }

  const invalidatoremail=(event)=>{
    const invalidemail=[];
    values.map((value, index) => {
      return (
            value.map((val, i) => {
            if(!validator.isEmail(val)){
              invalidemail.push(val);
            }
          })
      );
    })
    setInvalidEmails(invalidemail);
    setIsvalidEmails(false);
    setIsinvalidEmails(true);
    //setValidEmails([]);
  }

  const data1 = invalidEmails.map((value, index) => {
    return (
      <tr key={index}>
        {value}
      </tr>
    );
  });

  const data2 = validEmails.map((value, index) => {
    return (
      <tr key={index}>
        {value}
      </tr>
    );
  });

  return (
<>
    <div className="container">
         <h3 className="text-center text-success mb-2 mt-4">Mass Mail Dispatcher </h3>
      <div class="row">  
      
       <div className="col-sm-4 mx-auto shadow p-5">
        <h4 className="text-center mb-2">Send E Mail </h4>
           <p class="mb-3 mt-2" style={{color:"green",marginLeft:"57px"}}><b>{msg}</b></p>
           <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Email"
              name="from"
              onChange={onInputChange}
              value={user.from}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Password"
              name="pass"
              onChange={onInputChange}
              value={user.pass}
            />
          </div>
        
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Subject"
              name="subject"
              onChange={onInputChange}
              value={user.subject}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Description"
              name="description"
              onChange={onInputChange}
              value={user.description}
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="file"
              className="form-control form-control-lg"
              onChange={handleChange}
            />
          </div>

          <div className="container mb-3">
          <h5 className="text-center text-primary">Choose CSV file</h5>
          <input
            className="text-center"
            type="file"
            name="file"
            onChange={changeHandler}
            accept=".csv"
            style={{ display: "block", margin: "10px auto" }}
      />
 
          </div>
  
     
      </div>
    </div>
  </div>

    <div>
      {/* File Uploader */}

      <br />
      <br />
      <div className="d-flex justify-content-center">
      <button onClick={validatoremail} className="btn btn-primary btn-block " style={{marginRight:"10px"}}>Valid Emails</button>
      <button onClick={invalidatoremail} className="btn btn-primary btn-block " style={{marginRight:"00px"}}>Invalid Emails</button>
      <button onClick={onSubmit} className="btn btn-primary btn-block " style={{marginLeft:"10px"}}>Send Emails</button>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            {tableRows.map((rows, index) => {
              return <th key={index}>{rows}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          { isinvalidEmails===true? data1: ''}
          {isvalidEmails===true ? data2: ''}
        </tbody>
      </table>
    </div>
    </>
  );
}
export default App;