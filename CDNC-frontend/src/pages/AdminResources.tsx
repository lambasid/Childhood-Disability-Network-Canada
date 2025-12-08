import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clearAdminSession } from "@/lib/adminAuth";
import { useResources } from "@/hooks/useResourcesStore";
import type { Resource } from "@/lib/resourcesData";

type FormState = Omit<Resource, "id">;

const emptyForm: FormState = {
  title: "",
  description: "",
  url: "",
  province: "",
  category: "",
};

const categoryOptions = [
  "Guide",
  "Financial",
  "Community",
  "Advocacy",
  "Support",
  "Benefit",
  "Service",
  "Education",
  "Research",
  "Government Program",
  "Self-Care",
  "Checklist",
  "Grant",
  "Other",
];

const AdminResources = () => {
  const navigate = useNavigate();
  const { resources, addResource, updateResource, deleteResource } = useResources();
  const [formState, setFormState] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateResource(editingId, formState);
    } else {
      addResource(formState);
    }
    setDialogOpen(false);
    setEditingId(null);
    setFormState(emptyForm);
  };

  const startEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setFormState({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      province: resource.province,
      category: resource.category,
    });
    if (!categoryOptions.includes(resource.category)) {
      setCustomCategory(resource.category);
    } else {
      setCustomCategory("");
    }
    setDialogOpen(true);
  };

  const startAdd = () => {
    setEditingId(null);
    setFormState(emptyForm);
    setCustomCategory("");
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const resource = resources.find((item) => item.id === id);
    if (!resource) return;
    const confirmed = window.confirm(`Delete "${resource.title}"?`);
    if (confirmed) {
      deleteResource(id);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f5f1ff] px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-purple-700 font-semibold">Government Funding and Support</p>
            <h1 className="text-3xl font-bold text-purple-950">Resources Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Add, edit, or remove resources shown on the public Resources page.</p>
            <p className="text-sm text-purple-700 mt-1">
              All existing resources remain intact; updates here instantly reflect on the public page.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-purple-200 text-purple-900" onClick={handleLogout}>
              Logout
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-900 hover:bg-purple-dark text-white" onClick={startAdd}>
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl bg-white border border-purple-200 shadow-2xl">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-purple-900">{editingId ? "Edit Resource" : "Add Resource"}</DialogTitle>
                      <DialogDescription>Update the public resources list below.</DialogDescription>
                    </div>
                    {editingId ? (
                      <Badge variant="outline" className="border-purple-200 text-purple-900">
                        Editing
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        New
                      </Badge>
                    )}
                  </div>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-semibold text-purple-900">
                        Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g. Caregiver Recognition Benefit"
                        value={formState.title}
                        onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                        className="border-purple-100 focus-visible:ring-purple bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province" className="text-sm font-semibold text-purple-900">
                        Province
                      </Label>
                      <Input
                        id="province"
                        placeholder="National, Ontario, British Columbia..."
                        value={formState.province}
                        onChange={(e) => setFormState({ ...formState, province: e.target.value })}
                        className="border-purple-100 focus-visible:ring-purple bg-white"
                        required
                      />
                      <p className="text-xs text-gray-500">Use "National" for nationwide resources.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-semibold text-purple-900">
                        Category
                      </Label>
                      <Select
                        value={categoryOptions.includes(formState.category) ? formState.category : "Other"}
                        onValueChange={(value) => {
                          if (value === "Other") {
                            setFormState({ ...formState, category: customCategory || "" });
                          } else {
                            setCustomCategory("");
                            setFormState({ ...formState, category: value });
                          }
                        }}
                      >
                        <SelectTrigger className="border-purple-100 focus-visible:ring-purple bg-white text-left">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-purple-200">
                          {categoryOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {(!categoryOptions.includes(formState.category) || formState.category === "" || formState.category === customCategory) && (
                        <div className="space-y-1">
                          <Label htmlFor="custom-category" className="text-xs text-purple-900">
                            Custom category
                          </Label>
                          <Input
                            id="custom-category"
                            placeholder="Enter a category label"
                            value={customCategory}
                            onChange={(e) => {
                              setCustomCategory(e.target.value);
                              setFormState({ ...formState, category: e.target.value });
                            }}
                            className="border-purple-100 focus-visible:ring-purple bg-white"
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url" className="text-sm font-semibold text-purple-900">
                        URL
                      </Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://example.com/resource"
                        value={formState.url}
                        onChange={(e) => setFormState({ ...formState, url: e.target.value })}
                        className="border-purple-100 focus-visible:ring-purple bg-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-purple-900">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Short summary to help caregivers understand the value."
                      value={formState.description}
                      onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                      className="border-purple-100 focus-visible:ring-purple bg-white"
                      required
                      rows={4}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-end gap-2">
                    <Button type="button" variant="outline" className="border-purple-300 text-purple-900 hover:bg-purple-50" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-purple-900 hover:bg-purple-950 text-white">
                      {editingId ? "Save Changes" : "Add Resource"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="shadow-md border-purple-200 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-purple-950">Resources</CardTitle>
                <CardDescription className="text-gray-700">All items powering the public Resources experience.</CardDescription>
              </div>
              <Badge variant="outline" className="border-purple-200 text-purple-900">
                {resources.length} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium text-purple-900 max-w-xs">
                        <div className="line-clamp-2">{resource.title}</div>
                        <p className="text-xs text-gray-500 line-clamp-2">{resource.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-purple-200 text-purple-900">
                          {resource.province}
                        </Badge>
                      </TableCell>
                      <TableCell>{resource.category}</TableCell>
                      <TableCell>
                        <a href={resource.url} target="_blank" rel="noreferrer" className="text-purple-700 underline">
                          Link
                        </a>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="border-purple-200 text-purple-900" onClick={() => startEdit(resource)}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-200 text-red-700" onClick={() => handleDelete(resource.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminResources;
