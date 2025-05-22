"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { ConcertService } from "@/services/concerts.service";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

type Concert = {
  id: number;
  name: string;
  description: string;
  totalSeats: number;
};

type DashboardStats = {
  totalSeats: number;
  reservedSeats: number;
  canceledSeats: number;
};

export const AdminHomePage = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalSeats: 0,
    reservedSeats: 0,
    canceledSeats: 0,
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalSeats, setTotalSeats] = useState<number>(500);
  const [loading, setLoading] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [concertList, stats] = await Promise.all([
        ConcertService.getConcerts(),
        ConcertService.getStats(),
      ]);
      setConcerts(concertList);
      setDashboardStats(stats);
    } catch (error) {
      alert("Failed to load dashboard data.");
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || totalSeats <= 0) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const body = {
      name,
      description,
      totalSeats,
      availableSeats: totalSeats,
    };
    try {
      const res = await ConcertService.createConcert(body);

      fetchData(); // reload list
      setName("");
      setDescription("");
      setTotalSeats(500);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Failed to create concert");
      } else {
        console.error("Unknown error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDelete = (concert: { id: string; name: string }) => {
    setSelectedConcert(concert);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedConcert) return;
    try {
      await ConcertService.deleteConcert(selectedConcert.id);
      fetchData(); // รีโหลด concert ใหม่
    } catch (error) {
      alert("Failed to delete concert.");
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <Box p={4}>
      {/* Summary Cards */}
      <Grid container spacing={2} mb={2}>
        <Grid size={4}>
          <Card sx={{ bgcolor: "#1976d2", color: "#fff" }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1">Total of seats</Typography>
              <Typography variant="h4">{dashboardStats.totalSeats}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card sx={{ bgcolor: "#2e7d32", color: "#fff" }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1">Reserve</Typography>
              <Typography variant="h4">
                {dashboardStats.reservedSeats}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card sx={{ bgcolor: "#d32f2f", color: "#fff" }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1">Cancel</Typography>
              <Typography variant="h4">
                {dashboardStats.canceledSeats}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={(_, newIndex) => setTabIndex(newIndex)}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Overview" />
        <Tab label="Create" />
      </Tabs>

      {tabIndex === 0 && (
        <Box mt={3}>
          {concerts.map((concert) => (
            <Card key={concert.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {concert.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {concert.description}
                </Typography>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2">{concert.totalSeats}</Typography>
                  <Button
                    color="error"
                    variant="contained"
                    size="small"
                    onClick={() =>
                      handleOpenDelete({
                        id: concert.id.toString(),
                        name: concert.name,
                      })
                    }
                  >
                    Delete
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {tabIndex === 1 && (
        <Box mt={3} p={3} border={1} borderColor="#ddd" borderRadius={2}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Create
          </Typography>

          <Grid container spacing={2} mb={2}>
            <Grid size={6}>
              <TextField
                label="Concert Name"
                fullWidth
                placeholder="Please input concert name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Total of seat"
                type="number"
                fullWidth
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Description"
                multiline
                rows={3}
                fullWidth
                placeholder="Please input description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<span>💾</span>}
              onClick={handleSubmit}
              disabled={loading}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}

      <DeleteConfirmDialog
        open={isDialogOpen}
        title="Are you sure to delete?"
        concertName={selectedConcert?.name || ""}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};
