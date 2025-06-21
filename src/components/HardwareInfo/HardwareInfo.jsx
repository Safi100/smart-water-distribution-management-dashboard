import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import {
  Memory as MemoryIcon,
  Sensors as SensorsIcon,
  Water as WaterIcon,
  SettingsInputComponent as ComponentIcon,
  ElectricBolt as ElectricIcon
} from '@mui/icons-material';
import './HardwareInfo.css';

const HardwareInfo = ({ hardwareData, title = "Hardware Configuration" }) => {
  if (!hardwareData) {
    return (
      <Card className="hardware-card">
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            No hardware data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const hardwareItems = [
    {
      key: 'waterflow_sensor',
      label: 'Water Flow Sensor',
      icon: <WaterIcon />,
      color: '#2196F3',
      description: 'Measures water flow rate'
    },
    {
      key: 'solenoid_valve',
      label: 'Solenoid Valve',
      icon: <ComponentIcon />,
      color: '#FF9800',
      description: 'Controls water flow on/off'
    },
    {
      key: 'ultrasonic_sensor_echo',
      label: 'Ultrasonic Echo Pin',
      icon: <SensorsIcon />,
      color: '#4CAF50',
      description: 'Receives ultrasonic signals'
    },
    {
      key: 'ultrasonic_sensor_trig',
      label: 'Ultrasonic Trigger Pin',
      icon: <ElectricIcon />,
      color: '#9C27B0',
      description: 'Sends ultrasonic signals'
    }
  ];

  return (
    <Card className="hardware-card" elevation={3}>
      <CardContent>
        <Box className="hardware-header">
          <MemoryIcon className="hardware-main-icon" />
          <Typography variant="h5" className="hardware-title">
            {title}
          </Typography>
        </Box>
        
        <Divider className="hardware-divider" />
        
        <Grid container spacing={3} className="hardware-grid">
          {hardwareItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.key}>
              <Paper className="hardware-item" elevation={2}>
                <Box className="hardware-item-header">
                  <Box 
                    className="hardware-icon-container"
                    sx={{ backgroundColor: `${item.color}20` }}
                  >
                    {React.cloneElement(item.icon, { 
                      sx: { color: item.color, fontSize: 28 } 
                    })}
                  </Box>
                  <Typography variant="h6" className="hardware-item-title">
                    {item.label}
                  </Typography>
                </Box>
                
                <Box className="hardware-item-content">
                  <Chip 
                    label={`Pin ${hardwareData[item.key]}`}
                    variant="outlined"
                    size="small"
                    className="hardware-pin-chip"
                    sx={{ 
                      borderColor: item.color,
                      color: item.color,
                      fontWeight: 'bold'
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    className="hardware-description"
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Hardware Summary */}
        <Box className="hardware-summary">
          <Typography variant="h6" className="summary-title">
            Hardware Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box className="summary-item">
                <Typography variant="body2" color="text.secondary">
                  Total Components
                </Typography>
                <Typography variant="h6" color="primary">
                  {Object.keys(hardwareData).length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="summary-item">
                <Typography variant="body2" color="text.secondary">
                  Sensors
                </Typography>
                <Typography variant="h6" color="success.main">
                  3
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="summary-item">
                <Typography variant="body2" color="text.secondary">
                  Actuators
                </Typography>
                <Typography variant="h6" color="warning.main">
                  1
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="summary-item">
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label="Active" 
                  color="success" 
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HardwareInfo;
