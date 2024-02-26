# React-Barcode-Cam-Scanner

This is a basic React component developed in Javascript, designed to offer a webcam-based barcode scanner using the @zxing/library. Compatible with both computers and mobile devices (iOS 11 and newer, and Android phones).

# Usage in React:
```
import React from 'react';
import BarcodeScanner from "react-barcode-cam-scanner";

function App() {

  const [ data, setData ] = React.useState('Not Found');

  return (
    <>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (result) setData(result.text)
          else setData('Not Found')
        }}
      />
      <p>{data}</p>
    </>
  )
}
```
export default App;




