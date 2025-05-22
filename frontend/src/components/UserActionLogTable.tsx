"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

type UserActionLog = {
  id: string;
  userId: string;
  action: string;
  details?: string;
  createdAt: string;
};

export default function UserActionLogTable() {
  const [logs, setLogs] = useState<UserActionLog[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reservation/user-actions`, {
        params: { userId: "1" }, // mock user
      })
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Failed to load logs:", err));
  }, []);

  return (
    <TableContainer
      component={Paper}
      sx={{ border: "2px solid #2196f3", mt: 4 }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
          <TableRow>
            <TableCell>
              <b>Date time</b>
            </TableCell>
            <TableCell>
              <b>Username</b>
            </TableCell>
            <TableCell>
              <b>Concert name</b>
            </TableCell>
            <TableCell>
              <b>Action</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {dayjs(log.createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </TableCell>
              <TableCell>Sara John</TableCell> {/* mock */}
              <TableCell>{log.details}</TableCell>
              <TableCell>
                {log.action.includes("Cancel") ? "Cancel" : "Reserve"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
