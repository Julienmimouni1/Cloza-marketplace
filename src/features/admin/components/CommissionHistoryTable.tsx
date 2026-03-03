"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface HistoryEntry {
  id: string;
  oldRate: number | null;
  newRate: number | null;
  changedBy: string;
  reason: string | null;
  createdAt: Date;
}

interface Props {
  history: HistoryEntry[];
}

export function CommissionHistoryTable({ history }: Props) {
  if (history.length === 0) {
    return <div className="text-sm text-zinc-500 italic p-4">No commission history found.</div>;
  }

  return (
    <div className="rounded-md border border-zinc-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Old Rate</TableHead>
            <TableHead>New Rate</TableHead>
            <TableHead>Changed By</TableHead>
            <TableHead>Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">
                {format(new Date(entry.createdAt), "PPP p")}
              </TableCell>
              <TableCell>
                {entry.oldRate !== null ? `${(entry.oldRate / 100).toFixed(2)}%` : "Global"}
              </TableCell>
              <TableCell>
                {entry.newRate !== null ? `${(entry.newRate / 100).toFixed(2)}%` : "Global"}
              </TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">
                {entry.changedBy}
              </TableCell>
              <TableCell>{entry.reason || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
