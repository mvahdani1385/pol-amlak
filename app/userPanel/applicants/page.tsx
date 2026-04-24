"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

interface Applicant {
  id: number;
  title: string;
  slug: string;
  fullName?: string;
  mobile?: string;
  email?: string;
  propertyType: string;
  dealType: string;
  status: string;
  budgetMin?: number;
  budgetMax?: number;
  city?: string;
  province?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDealType, setFilterDealType] = useState("");
  const [filterPropertyType, setFilterPropertyType] = useState("");

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append("fullName", searchTerm);
      if (filterStatus) params.append("status", filterStatus);
      if (filterDealType) params.append("dealType", filterDealType);
      if (filterPropertyType) params.append("propertyType", filterPropertyType);

      const response = await fetch(`/api/applicants?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setApplicants(data);
      } else {
        toast.error("Error fetching applicants");
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast.error("Error fetching applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this applicant?")) {
      return;
    }

    try {
      const response = await fetch(`/api/applicants/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Applicant deleted successfully");
        fetchApplicants();
      } else {
        toast.error("Error deleting applicant");
      }
    } catch (error) {
      console.error("Error deleting applicant:", error);
      toast.error("Error deleting applicant");
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/applicants/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Status updated successfully");
        fetchApplicants();
      } else {
        toast.error("Error updating status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = !searchTerm || 
      applicant.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.mobile?.includes(searchTerm);
    
    const matchesStatus = !filterStatus || applicant.status === filterStatus;
    const matchesDealType = !filterDealType || applicant.dealType === filterDealType;
    const matchesPropertyType = !filterPropertyType || applicant.propertyType === filterPropertyType;

    return matchesSearch && matchesStatus && matchesDealType && matchesPropertyType;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Applicants Management</h1>
          <Link
            href="/userPanel/applicants/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Applicant
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deal Type</label>
              <select
                value={filterDealType}
                onChange={(e) => setFilterDealType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Deal Types</option>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
                <option value="Rent">Rent</option>
                <option value="Partnership">Partnership</option>
                <option value="Pre-sale">Pre-sale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Property Type</label>
              <select
                value={filterPropertyType}
                onChange={(e) => setFilterPropertyType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Property Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Land">Land</option>
                <option value="Office">Office</option>
                <option value="Shop">Shop</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2">Loading applicants...</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No applicants found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget Range
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {applicant.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {applicant.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {applicant.fullName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {applicant.mobile && (
                          <div>{applicant.mobile}</div>
                        )}
                        {applicant.email && (
                          <div className="text-xs text-gray-500">{applicant.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {applicant.propertyType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {applicant.dealType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {applicant.budgetMin || applicant.budgetMax ? (
                          <>
                            {applicant.budgetMin && (
                              <span>${applicant.budgetMin.toLocaleString()}</span>
                            )}
                            {applicant.budgetMin && applicant.budgetMax && " - "}
                            {applicant.budgetMax && (
                              <span>${applicant.budgetMax.toLocaleString()}</span>
                            )}
                          </>
                        ) : (
                          "Not specified"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {applicant.city && (
                          <div>{applicant.city}</div>
                        )}
                        {applicant.province && (
                          <div className="text-xs text-gray-500">{applicant.province}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={applicant.status}
                        onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                        className={`text-sm px-2 py-1 rounded ${
                          applicant.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(applicant.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <Link
                          href={`/userPanel/applicants/${applicant.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/userPanel/applicants/${applicant.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(applicant.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Total: {filteredApplicants.length} applicants
      </div>
    </div>
  );
}
