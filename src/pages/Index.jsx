import React, { useState } from "react";
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

function Index() {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setHeaders(Object.keys(result.data[0]));
        setCsvData(result.data);
      },
    });
  };

  const handleAddRow = () => {
    setCsvData([...csvData, {}]);
  };

  const handleRemoveRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const handleCellChange = (index, key, value) => {
    const newData = [...csvData];
    newData[index][key] = value;
    setCsvData(newData);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="text-center">
        <h1 className="text-3xl">CSV Upload, Edit, and Download Tool</h1>
        <p>Upload a .csv file, edit the data, and download the updated file.</p>
      </div>
      <div className="flex justify-center">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      {csvData.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Input
                        type="text"
                        value={row[header] || ""}
                        onChange={(e) =>
                          handleCellChange(rowIndex, header, e.target.value)
                        }
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveRow(rowIndex)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button onClick={handleAddRow}>Add Row</Button>
            <CSVLink data={csvData} headers={headers} filename={"edited.csv"}>
              <Button>Download CSV</Button>
            </CSVLink>
          </div>
        </>
      )}
    </main>
  );
}

export default Index;