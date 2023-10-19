import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Container, TextField, Typography, CircularProgress, TextareaAutosize } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { getAvailableVehicles, submitForm} from '../services'
import {Vehicle, SubmitObj} from '../types'

interface ModelList {
  [make: string]: {
    [model: string]: string[];
  };
}

const App: React.FC = () => {
  const [vehicles, setVehicles] = useState<ModelList>({})
  const [isLoading, setIsLoading] = useState(true);
  const [submitRes, setSubmitRes] = useState('')
  const [make, setMake] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [badge, setBadge] = useState<string | null>(null);
  const [logbook, setLogbook] = useState<File | null>(null);

  useEffect(() => {
    getAvailableVehicles().then((res: ModelList | null) => {
      if (res) {
        setVehicles(res)
        setIsLoading(false)
      }
    })
    .catch((e: Error) => {
      console.error(e)
      setIsLoading(false)
    })
    
  }, [])

  const handleMakeChange = (event: React.ChangeEvent<{}>, newValue: string | null) => {
    setMake(newValue);
    setModel(null);
    setBadge(null);
  };

  const handleModelChange = (event: React.ChangeEvent<{}>, newValue: string | null) => {
    setModel(newValue);
    setBadge(null);
  };

  const handleSubmit = (vehicle: SubmitObj) => {
    const formData = new FormData()
    formData.append("make", vehicle.make || '');
    formData.append("model", vehicle.model || '');
    formData.append("badge", vehicle.badge || '');
    formData.append("logbook", vehicle.logbook || '');

    submitForm(vehicle)
      .then((res) => setSubmitRes(res?.message))
  }

  const handlePredefinedOption = (vehicle: Vehicle) => {
    setMake(vehicle.make);
    setModel(vehicle.model);
    setBadge(vehicle.badge);
  };
  const sample1 = useMemo(() => {
    const sampleMake = Object.keys(vehicles || {})[0]
    const sampleModel = Object.keys(vehicles?.[sampleMake] || {})[0]
    const sampleBadge = vehicles?.[sampleMake]?.[sampleModel]?.[0]
    return {
      make: sampleMake,
      model: sampleModel,
      badge: sampleBadge
    }
  }, [vehicles])
  

  if (isLoading) {
    return  <CircularProgress />
  }

  const InstantButton = ({vehicle}: {vehicle: Vehicle}) => {
    const name = `${vehicle.make} ${vehicle.model} ${vehicle.badge}`
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handlePredefinedOption(vehicle)}
      >{name}</Button>
    )
  }

  

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        minHeight="100vh"
        sx={{flexDirection: 'column', gap: 2}}
      >
      <Typography variant="h6" align="center">
        Cars zoom zoom
      </Typography>
      <Autocomplete
        options={Object.keys(vehicles)}
        getOptionLabel={(option) => option}
        value={make}
        onChange={handleMakeChange}
        renderInput={(params) => <TextField {...params} label="Make" />}
      />
      <Autocomplete
        options={Object.keys(vehicles[make || '']|| {}) || []}
        getOptionLabel={(option) => option}
        value={model}
        onChange={handleModelChange}
        renderInput={(params) => <TextField {...params} label="Model" />}
      />
      {make && model && vehicles[make] && vehicles[make][model] && (
        <Autocomplete
          options={vehicles[make][model] || []}
          getOptionLabel={(option) => option}
          value={badge}
          onChange={(event: React.ChangeEvent<{}>, newValue: string | null) => setBadge(newValue)}
          renderInput={(params) => <TextField {...params} label="Badge" />}
        />
      )}
      <Typography variant="body1" style={{ marginTop: 16 }}>
        Upload log Text
      </Typography>
      <input
        style={{width: '200px'}}
        type="file"
        accept=".txt"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLogbook(e.target.files ? e.target.files[0] : null)
        }
      />
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: 16 }}
        onClick={() => handleSubmit({ make, model, badge, logbook })}
      >
        Submit
      </Button>
      <Box>
        <Typography variant="h6" align="center">
          Select a vehicle
        </Typography>
        <InstantButton vehicle={sample1}/>
      </Box>
      {submitRes && (
        <div>
          <Typography variant="h6" style={{ marginTop: 16 }}>
            Submit Response
          </Typography>
          <TextareaAutosize
            minRows={3}
            maxRows={6}
            placeholder="Response Message"
            value={submitRes}
            readOnly
          />
        </div>
      )}
      </Box>
    </Container>
  );
};

export default App;
