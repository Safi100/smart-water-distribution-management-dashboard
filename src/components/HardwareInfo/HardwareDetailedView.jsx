import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import "./HardwareDetailedView.css";
import {
  ExpandMore as ExpandMoreIcon,
  Memory as MemoryIcon,
  Sensors as SensorsIcon,
  Water as WaterIcon,
  SettingsInputComponent as ComponentIcon,
  ElectricBolt as ElectricIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

const HardwareDetailedView = ({
  tankData,
  title = "Hardware Configuration Details",
}) => {
  const [expanded, setExpanded] = useState("hardware");

  if (!tankData?.hardware) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            No hardware data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const hardwareData = tankData.hardware;

  const hardwareSpecs = [
    {
      key: "waterflow_sensor",
      label: "Water Flow Sensor",
      icon: <WaterIcon />,
      color: "#2196F3",
      type: "Sensor",
      voltage: "5V DC",
      current: "15mA",
      accuracy: "±2%",
      range: "1-30 L/min",
      description: "Measures real-time water flow rate through the system",
    },
    {
      key: "solenoid_valve",
      label: "Solenoid Valve",
      icon: <ComponentIcon />,
      color: "#FF9800",
      type: "Actuator",
      voltage: "12V DC",
      current: "500mA",
      pressure: "0-10 bar",
      response: "10ms",
      description: "Electronically controlled valve for water flow control",
    },
    {
      key: "ultrasonic_sensor_echo",
      label: "Ultrasonic Echo Pin",
      icon: <SensorsIcon />,
      color: "#4CAF50",
      type: "Sensor Input",
      voltage: "5V TTL",
      frequency: "40kHz",
      range: "2cm-4m",
      accuracy: "±3mm",
      description:
        "Receives reflected ultrasonic waves for distance measurement",
    },
    {
      key: "ultrasonic_sensor_trig",
      label: "Ultrasonic Trigger Pin",
      icon: <ElectricIcon />,
      color: "#9C27B0",
      type: "Sensor Output",
      voltage: "5V TTL",
      pulse: "10μs",
      frequency: "40kHz",
      power: "15mA",
      description: "Sends ultrasonic pulses for distance measurement",
    },
  ];

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getStatusColor = (pin) => {
    return pin > 0 ? "success" : "error";
  };

  const getStatusIcon = (pin) => {
    return pin > 0 ? <CheckIcon /> : <WarningIcon />;
  };

  return (
    <Box className="hardware-detailed-container">
      {/* Hardware Overview */}
      <Accordion
        expanded={expanded === "hardware"}
        onChange={handleAccordionChange("hardware")}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={2}>
            <MemoryIcon color="primary" />
            <Typography variant="h6">{title}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {hardwareSpecs.map((spec) => (
              <Grid item xs={12} md={6} key={spec.key}>
                <Paper
                  elevation={2}
                  className="hardware-spec-card"
                  sx={{ p: 2, height: "100%" }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box
                      className="hardware-spec-icon-container"
                      sx={{
                        backgroundColor: `${spec.color}20`,
                      }}
                    >
                      {React.cloneElement(spec.icon, {
                        sx: { color: spec.color, fontSize: 24 },
                      })}
                    </Box>
                    <Box flex={1}>
                      <Typography variant="h6" gutterBottom>
                        {spec.label}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={`Pin ${hardwareData[spec.key]}`}
                          color={getStatusColor(hardwareData[spec.key])}
                          size="small"
                          icon={getStatusIcon(hardwareData[spec.key])}
                        />
                        <Chip
                          label={spec.type}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {spec.description}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Grid container spacing={1}>
                    {spec.voltage && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Voltage
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {spec.voltage}
                        </Typography>
                      </Grid>
                    )}
                    {spec.current && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Current
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {spec.current}
                        </Typography>
                      </Grid>
                    )}
                    {spec.range && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Range
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {spec.range}
                        </Typography>
                      </Grid>
                    )}
                    {spec.accuracy && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Accuracy
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {spec.accuracy}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Pin Configuration Table */}
      <Accordion
        expanded={expanded === "pins"}
        onChange={handleAccordionChange("pins")}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={2}>
            <ElectricIcon color="primary" />
            <Typography variant="h6">Pin Configuration</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer
            component={Paper}
            className="hardware-table-container"
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Component</TableCell>
                  <TableCell>Pin Number</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Info</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hardwareSpecs.map((spec) => (
                  <TableRow key={spec.key}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {React.cloneElement(spec.icon, {
                          sx: { color: spec.color, fontSize: 20 },
                        })}
                        {spec.label}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={hardwareData[spec.key]}
                        color={getStatusColor(hardwareData[spec.key])}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{spec.type}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          hardwareData[spec.key] > 0 ? "Active" : "Inactive"
                        }
                        color={getStatusColor(hardwareData[spec.key])}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={spec.description}>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* System Status */}
      <Accordion
        expanded={expanded === "status"}
        onChange={handleAccordionChange("status")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={2}>
            <CheckIcon color="success" />
            <Typography variant="h6">System Status</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="status-card">
                <Typography variant="h4" color="primary">
                  {Object.keys(hardwareData).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Components
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="status-card">
                <Typography variant="h4" color="success.main">
                  {Object.values(hardwareData).filter((pin) => pin > 0).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Pins
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="status-card">
                <Typography variant="h4" color="info.main">
                  {tankData.current_level?.toFixed(2) || "0.00"}L
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Level
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="status-card">
                <Typography variant="h4" color="warning.main">
                  {tankData.max_capacity?.toFixed(2) || "0.00"}L
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Max Capacity
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default HardwareDetailedView;
