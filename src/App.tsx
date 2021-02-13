import React, { Component } from 'react';
import './App.css';
import CSVReader, { IFileInfo } from 'react-csv-reader';
import SortableTable from 'react-sortable-table';

interface MyState {
  data1: Array<row>;
  data2: Array<row>;
  tableData: Array<row>;
};

interface row {
  id: string;
  company_name: string;
  employee_count: string;
};

class App extends Component<{}, MyState> {
  constructor(props: any) {
    super(props);
    this.onFileLoaded = this.onFileLoaded.bind(this);
    this.createTable = this.createTable.bind(this);
    this.state = {
      data1: [],
      data2: [],
      tableData: []
    };
  }

  onFileLoaded(rawData: any, fileInfo: IFileInfo) {
    const data = rawData.map((row: any) => {
      return {
        id: row[0],
        company_name: row[1],
        employee_count: row[2]
      };
    });
    if (fileInfo.name.includes('1')) {
      this.setState({ data1: data });
    } else if (fileInfo.name.includes('2')) {
      this.setState({ data2: data });
    }
    if (this.state.data1.length && this.state.data2.length) {
      this.createTable();
    }
  }

  createTable() {
    let tableData = [];
    for (let i = 0; i < this.state.data1.length; i++) {
      const d1 = this.state.data1[i];
      const d2 = this.state.data2.find(elt => elt.id === d1.id);
      if (d2) {
        let obj = { id: '', company_name: '', employee_count: '' };
        obj['id'] = d1.id;
        if (d1.company_name === d2.company_name) {
          obj['company_name'] = d1.company_name;
        } else {
          obj['company_name'] = `${d1.company_name} (${d2.company_name})`;
        }
        if (d1.employee_count === d2.employee_count) {
          obj['employee_count'] = d1.employee_count;
        } else {
          obj['employee_count'] = `${d1.employee_count} (${d2.employee_count})`;
        }
        tableData[i] = obj;
      }
    }
    this.setState({ tableData });
  }

  render() {
    const parserOptions = { skipEmptyLines: true };
    const columns = [{
      header: 'ID',
      key: 'id',
      render: (id: string) => { return <p>{id}</p> }
    }, {
      header: 'Company name',
      key: 'company_name',
      render: (name: string) => { return <p>{name}</p> }
    }, {
      header: 'Employee count',
      key: 'employee_count',
      render: (count: string) => { return <p>{count}</p> }
    }];

    return (
      <div className="App-header">
        <CSVReader
          onFileLoaded={this.onFileLoaded}
          parserOptions={parserOptions} />
        <SortableTable
          data={this.state.tableData}
          columns={columns} />
      </div>
    );
  }
}

export default App;
