import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' },
};

export default function InternshipTable({ internships, onStatusChange, onViewDetails }) {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Internship Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Stipend</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {internships.map((internship) => (
            <TableRow key={internship.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <img src={internship.companyLogoUrl || `https://avatar.vercel.sh/${internship.companyName}.png`} alt={internship.companyName} className="h-8 w-8 rounded-full object-contain border" />
                  <div>
                    <div className="font-medium">{internship.companyName}</div>
                    <div className="text-xs text-gray-500">{internship.recruiterName}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{internship.title}</TableCell>
              <TableCell>{internship.location}</TableCell>
              <TableCell>{internship.stipend}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusConfig[internship.status].color}>
                  {statusConfig[internship.status].label}
                </Badge>
              </TableCell>
              <TableCell>{internship.postedAt ? new Date(internship.postedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(internship)}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  {internship.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => onStatusChange(internship.id, 'approved')}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => onStatusChange(internship.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4" />
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