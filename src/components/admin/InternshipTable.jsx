import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, XCircle, Eye } from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800 border-green-200" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200" },
};

export default function InternshipTable({ internships, onStatusChange, onViewDetails }) {
  if (internships.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="w-12 h-12 mx-auto mb-4 text-gray-300 flex items-center justify-center">
          <MoreHorizontal className="w-8 h-8" />
        </div>
        <p className="text-sm sm:text-base">No internships found in this category.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm w-[40%] sm:w-[35%]">Company</TableHead>
            <TableHead className="text-xs sm:text-sm w-[35%] sm:w-[30%]">Internship Title</TableHead>
            <TableHead className="text-xs sm:text-sm hidden sm:table-cell w-[15%]">Location</TableHead>
            <TableHead className="text-xs sm:text-sm hidden md:table-cell w-[10%]">Stipend</TableHead>
            <TableHead className="text-xs sm:text-sm w-[15%] sm:w-[10%]">Status</TableHead>
            <TableHead className="text-xs sm:text-sm hidden lg:table-cell w-[10%]">Posted</TableHead>
            <TableHead className="text-right text-xs sm:text-sm w-[10%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {internships.map((internship) => (
            <TableRow key={internship.id} className="hover:bg-gray-50">
              <TableCell className="py-2 sm:py-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <img
                    src={internship.companyLogoUrl || `https://avatar.vercel.sh/${internship.companyName}.png`}
                    alt={internship.companyName}
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-contain border flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm truncate">{internship.companyName}</div>
                    <div className="text-xs text-gray-500 truncate">{internship.recruiterName}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-2 sm:py-3">
                <div
                  className="text-xs sm:text-sm font-medium max-w-[80px] sm:max-w-[120px] md:max-w-[150px] truncate"
                  title={internship.title}
                >
                  {internship.title}
                </div>
              </TableCell>
              <TableCell className="py-2 sm:py-3 hidden sm:table-cell">
                <div className="text-xs sm:text-sm max-w-[60px] md:max-w-[80px] truncate" title={internship.location}>
                  {internship.location}
                </div>
              </TableCell>
              <TableCell className="py-2 sm:py-3 hidden md:table-cell">
                <div className="text-xs sm:text-sm max-w-[50px] lg:max-w-[70px] truncate" title={internship.stipend}>
                  {internship.stipend}
                </div>
              </TableCell>
              <TableCell className="py-2 sm:py-3">
                <Badge variant="outline" className={`${statusConfig[internship.status].color} text-xs`}>
                  {statusConfig[internship.status].label}
                </Badge>
              </TableCell>
              <TableCell className="py-2 sm:py-3 hidden lg:table-cell">
                <div className="text-xs sm:text-sm max-w-[60px] truncate">
                  {internship.postedAt
                    ? new Date(internship.postedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "-"}
                </div>
              </TableCell>
              <TableCell className="text-right py-2 sm:py-3">
                <div className="flex items-center justify-end gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(internship)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  {internship.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 h-7 w-7 sm:h-8 sm:w-8 p-0"
                        onClick={() => onStatusChange(internship.id, "approved")}
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 h-7 w-7 sm:h-8 sm:w-8 p-0"
                        onClick={() => onStatusChange(internship.id, "rejected")}
                      >
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
