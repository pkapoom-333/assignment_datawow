"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ConcertService } from "@/services/concerts.service";
import { ReservationService } from "@/services/reservation.service";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const userID = "1"; // ใช้ mock user ก่อน

type Concert = {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
  listReservation: {
    userId: string;
    canceledAt: string | null;
    status: string;
  }[];
};

export const UserDashboard = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loadingReserve, setLoadingReserve] = useState<string | null>(null);
  const [selectedConcert, setSelectedConcert] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      const concertList = await ConcertService.getConcerts();
      setConcerts(concertList);
    } catch (error) {
      alert("Failed to load concerts.");
    }
  };

  const handleReserve = async (concertId: string) => {
    setLoadingReserve(concertId);
    try {
      await ReservationService.reserve(userID, concertId);
      fetchData();
    } catch (error) {
      alert("Failed to reserve.");
    } finally {
      setLoadingReserve(null);
    }
  };

  const handleCancelReservation = async () => {
    if (!selectedConcert) return;
    try {
      await ReservationService.cancel({
        userId: userID,
        concertId: selectedConcert.id,
      });
      fetchData();
    } catch (error) {
      alert("Failed to cancel reservation.");
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleOpenCancel = (concert: { id: string; name: string }) => {
    setSelectedConcert(concert);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box p={4}>
      <Box mt={3}>
        {concerts.map((concert) => {
          const hasReservation = concert.listReservation.some(
            (r) => r.userId === userID && r.status === "CONFIRMED"
          );

          return (
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
                  <Typography variant="body2">
                    👤 {concert.totalSeats}
                  </Typography>
                  {hasReservation ? (
                    <Button
                      color="error"
                      variant="contained"
                      size="small"
                      onClick={() =>
                        handleOpenCancel({
                          id: concert.id,
                          name: concert.name,
                        })
                      }
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      color="info"
                      variant="contained"
                      size="small"
                      disabled={loadingReserve === concert.id}
                      onClick={() => handleReserve(concert.id)}
                    >
                      {loadingReserve === concert.id
                        ? "Reserving..."
                        : "Reserve"}
                    </Button>
                  )}
                </Grid>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <DeleteConfirmDialog
        open={isDialogOpen}
        title="Are you sure to cancel?"
        concertName={selectedConcert?.name || ""}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleCancelReservation}
      />
    </Box>
  );
};
