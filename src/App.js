import React, { useEffect, useState } from 'react';
import './App.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import * as signalR from "@microsoft/signalr";


function App() {
  const [data, setData] = useState([]);

  const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:5001/stream")
  .configureLogging(signalR.LogLevel.Information)
  .build();

  useEffect(() => {
    hubConnection.start().then(() => {
      hubConnection.stream("Temperatures").subscribe({
        next: (item) => {
          console.log(item);
          setData(currentData => [...currentData, item]);
        },
        complete: () => {
          console.log('completo');
        },
        error: (err) => {
          console.log(err);
        }
      })
    });
  }, []);


  return (
    <div className="chart">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="tempo" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temp1" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="temp2" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}

export default App;
