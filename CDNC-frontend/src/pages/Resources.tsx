import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, FileText, Link, Search, Globe, MapPin } from "lucide-react";
import { useResources } from "@/hooks/useResourcesStore";
import type { Resource } from "@/lib/resourcesData";

const Resources = () => {
  const location = useLocation();
  const { resources } = useResources();

  const [activeTab, setActiveTab] = useState("national");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fragment = location.hash.replace("#", "");
    if (fragment && ["national", "guides", "caregiving", "financial", "community", "provincial"].includes(fragment)) {
      const tabValue = fragment === "caregiving" ? "guides" : fragment;
      setActiveTab(tabValue);
    }
  }, [location]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location]);

  const filteredResources = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return resources;
    return resources.filter((resource) =>
      [resource.title, resource.description, resource.category, resource.province].some((field) =>
        field.toLowerCase().includes(term)
      )
    );
  }, [resources, searchTerm]);

  const guides = useMemo(() => filteredResources.filter((resource) => matchesCategory(resource, ["guide", "self-care", "checklist", "education"])), [filteredResources]);
  const financial = useMemo(() => filteredResources.filter((resource) => matchesCategory(resource, ["financial", "benefit", "tax", "fund", "grant"])), [filteredResources]);
  const community = useMemo(() => filteredResources.filter((resource) => matchesCategory(resource, ["community", "support", "service", "network", "advocacy", "program"])), [filteredResources]);
  const nationalResources = useMemo(
    () => filteredResources.filter((resource) => resource.province.toLowerCase() === "national"),
    [filteredResources]
  );
  const provincialResources = useMemo(
    () => filteredResources.filter((resource) => resource.province.toLowerCase() !== "national"),
    [filteredResources]
  );

  const nationalByCategory = useMemo(() => groupBy(nationalResources, (resource) => resource.category || "Other"), [nationalResources]);
  const provincialByProvince = useMemo(() => groupBy(provincialResources, (resource) => resource.province || "Other"), [provincialResources]);

  const featuredGuide = guides.find((item) => item.id === "guide-caregiver-handbook");
  const guideList = featuredGuide ? guides.filter((item) => item.id !== featuredGuide.id) : guides;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <section id="top" className="bg-purple-light/30 py-16 px-8">
          <div className="max-w-screen-xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-6">Government Funding and Support</h1>
            <p className="md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Access comprehensive guides, financial assistance information, and community support to help you navigate your caregiving journey.
            </p>
            <div className="relative max-w-xl mx-auto">
              <div className="flex items-center border-2 rounded-lg bg-transparent overflow-hidden">
                <Search className="ml-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full px-4 py-3 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="m-1 bg-purple-900 text-white hover:bg-purple-dark" onClick={() => setSearchTerm((prev) => prev.trim())}>
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 mb-10">
          <div className="max-w-screen-xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="mb-2 border-b overflow-x-auto">
                <TabsList className="bg-transparent mb-[-1px] flex-nowrap inline-flex w-full min-w-max md:w-auto">
                  <TabsTrigger value="national" className="data-[state=active]:border-b-2 data-[state=active]:border-purple rounded-none whitespace-nowrap text-xs md:text-sm flex-shrink-0">
                    <Globe className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">National Resources</span>
                    <span className="sm:hidden">National</span>
                  </TabsTrigger>
                  <TabsTrigger value="provincial" className="data-[state=active]:border-b-2 data-[state=active]:border-purple rounded-none whitespace-nowrap text-xs md:text-sm flex-shrink-0">
                    <MapPin className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Provincial Resources</span>
                    <span className="sm:hidden">Provincial</span>
                  </TabsTrigger>
                  <TabsTrigger value="guides" className="data-[state=active]:border-b-2 data-[state=active]:border-purple rounded-none whitespace-nowrap text-xs md:text-sm flex-shrink-0">
                    <Book className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Caregiving Guides</span>
                    <span className="sm:hidden">Guides</span>
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="data-[state=active]:border-b-2 data-[state=active]:border-purple rounded-none whitespace-nowrap text-xs md:text-sm flex-shrink-0">
                    <FileText className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Financial Support</span>
                    <span className="sm:hidden">Financial</span>
                  </TabsTrigger>
                  <TabsTrigger value="community" className="data-[state=active]:border-b-2 data-[state=active]:border-purple rounded-none whitespace-nowrap text-xs md:text-sm flex-shrink-0">
                    <Link className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Community Resources</span>
                    <span className="sm:hidden">Community</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="guides" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  <div className="col-span-full mb-1 bg-purple-light/20 px-0 py-3 mt-3 rounded-lg">
                    <h2 className="text-2xl font-bold text-purple-900 mb-3">Caregiving Guides</h2>
                    <h4 className="text-l font-semibold text-purple-900 mb-3">
                      Access comprehensive guides and tutorials for caregiving basics.
                    </h4>
                    <p className="text-gray-700">
                      Caregiving isn't just a role—it's a learning curve. Whether you're a parent navigating your child's new diagnosis, a grandparent stepping into daily care, or a sibling helping from a distance, these essential tools can empower you with confidence and clarity.
                    </p>
                    <div className="flex items-start mt-4">
                      <p className="text-sm italic text-gray-600">
                        <span className="font-semibold text-purple-900">Caregiving Tip:</span> You're not just a helper—you're part of the care team. These resources give you the confidence to speak up, ask questions, and advocate effectively.
                      </p>
                    </div>
                  </div>
                  {guideList.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                  {guideList.length === 0 ? <EmptyState /> : null}
                </div>
                {featuredGuide ? <FeaturedResource resource={featuredGuide} /> : null}
              </TabsContent>

              <TabsContent value="financial" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  <div className="col-span-full mb-1 bg-purple-light/20 px-0 py-3 mt-3 rounded-lg">
                    <h2 className="text-2xl font-bold text-purple-900 mb-3">Financial Support</h2>
                    <h4 className="text-l font-semibold text-purple-900 mb-3">
                      Find grants, subsidies, tax credits, and income relief programs to reduce your caregiving burden.
                    </h4>
                    <p className="text-gray-700">
                      The financial cost of caregiving can add up quickly—lost work hours, travel to appointments, medications, home modifications. These trusted links point to programs designed to help.
                    </p>
                    <div className="flex items-start mt-4">
                      <p className="text-sm italic text-gray-600">
                        <span className="font-semibold text-purple-900">Caregiving Insight:</span> Many families qualify for benefits but don’t apply because they don’t know they exist. Let’s change that.
                      </p>
                    </div>
                  </div>
                  {financial.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                  {financial.length === 0 ? <EmptyState /> : null}
                </div>
              </TabsContent>

              <TabsContent value="community" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  <div className="col-span-full mb-1 bg-purple-light/20 px-0 py-3 mt-3 rounded-lg">
                    <h2 className="text-2xl font-bold text-purple-900 mb-3">Community Resources</h2>
                    <h4 className="text-l font-semibold text-purple-900 mb-3">Share your journey. Find your people. Get real answers from those who’ve been there.</h4>
                    <p className="text-gray-700">
                      Caregiving can feel isolating—but it doesn’t have to be. Our community list connects caregivers, especially those raising children with disabilities, to support, advocacy, and shared knowledge.
                    </p>
                    <div className="flex items-start mt-4">
                      <p className="text-sm italic text-gray-600">You are not alone. There are others just like you—waiting to welcome you, listen to you, and support you.</p>
                    </div>
                  </div>
                  {community.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                  {community.length === 0 ? <EmptyState /> : null}
                </div>
              </TabsContent>

              <TabsContent value="national" className="mt-0">
                <div className="mt-2">
                  <div className="col-span-full mb-1 bg-purple-light/20 px-0 py-3 mt-3 rounded-lg">
                    <h2 className="text-2xl font-bold text-purple-900 mb-3">National Resources</h2>
                    <p className="text-gray-700 mb-2">
                      Centralized links to nationwide benefits, advocacy organizations, research bodies, and grant programs.
                    </p>
                    <p className="text-sm italic text-gray-600">Use these trusted sources to explore funding, connect to support networks, and amplify advocacy impact.</p>
                  </div>
                  <div className="space-y-8">
                    {Object.entries(nationalByCategory).map(([category, items]) => (
                      <div key={category}>
                        <h3 className="text-xl font-semibold text-purple-900 mb-3">{category}</h3>
                        <ul className="grid md:grid-cols-2 gap-2">
                          {items.map((item) => (
                            <li key={item.id} className="group">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-3 rounded-md border border-gray-200 hover:border-purple-400 hover:bg-purple-light/10 transition-colors text-sm text-gray-700"
                              >
                                <span className="flex-1">{item.title}</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-purple-600 group-hover:translate-x-0.5 transition-transform"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {nationalResources.length === 0 ? <EmptyState /> : null}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="provincial" className="mt-0">
                <div className="mt-2">
                  <div className="col-span-full mb-1 bg-purple-light/20 px-0 py-3 mt-3 rounded-lg">
                    <h2 className="text-2xl font-bold text-purple-900 mb-3">Provincial Resources</h2>
                    <p className="text-gray-700 mb-2">
                      Explore province-specific caregiver support organizations, advocacy groups, and government program portals.
                    </p>
                    <p className="text-sm italic text-gray-600">Access localized help that understands your regional systems and services.</p>
                  </div>
                  <div className="space-y-10">
                    {Object.entries(provincialByProvince).map(([province, links]) => (
                      <div key={province}>
                        <h3 className="text-xl font-semibold text-purple-900 mb-3">{province}</h3>
                        <ul className="grid md:grid-cols-2 gap-2">
                          {links.map((link) => (
                            <li key={link.id} className="group">
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-3 rounded-md border border-gray-200 hover:border-purple-400 hover:bg-purple-light/10 transition-colors text-sm text-gray-700"
                              >
                                <span className="flex-1">{link.title}</span>
                                <span className="ml-2 text-xs text-gray-500 italic">{link.category}</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-purple-600 ml-2 group-hover:translate-x-0.5 transition-transform"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {provincialResources.length === 0 ? <EmptyState /> : null}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const matchesCategory = (resource: Resource, keywords: string[]) =>
  keywords.some((keyword) => resource.category.toLowerCase().includes(keyword));

const groupBy = (items: Resource[], keySelector: (item: Resource) => string) => {
  return items.reduce<Record<string, Resource[]>>((acc, item) => {
    const key = keySelector(item);
    acc[key] = acc[key] ? [...acc[key], item] : [item];
    return acc;
  }, {});
};

const ResourceCard = ({ resource }: { resource: Resource }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-2">
      <div className="text-sm font-medium text-purple-900 mb-1">{resource.category}</div>
      <CardTitle className="text-xl">{resource.title}</CardTitle>
      <p className="text-xs text-gray-500">{resource.province}</p>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-gray-600 text-base">{resource.description}</CardDescription>
    </CardContent>
    <CardFooter>
      <a href={resource.url} target="_blank" className="text-purple-900 hover:text-purple-900 font-medium flex items-center" rel="noreferrer">
        View resource
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </CardFooter>
  </Card>
);

const FeaturedResource = ({ resource }: { resource: Resource }) => (
  <div className="max-w-screen-xl mx-auto mt-10 mb-10">
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 bg-purple-light p-8 flex items-center justify-center">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">{resource.title}</h3>
            <p className="text-gray-700 mb-6">{resource.description}</p>
            <Button
              className="bg-purple-900 text-white hover:bg-purple-dark"
              onClick={() => {
                const link = document.createElement("a");
                link.target = "_blank";
                link.href = resource.url;
                link.rel = "noreferrer";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              View resource
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 p-8">
          <h4 className="text-xl font-semibold mb-4">What's Inside:</h4>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-purple-light flex items-center justify-center text-purple-900 mr-1 mt-0.5">1.</div>
              <span>Step-by-step guidance for new caregivers.</span>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-purple-light flex items-center justify-center text-purple-900 mr-1 mt-0.5">2.</div>
              <span>Tips for managing daily responsibilities and care plans.</span>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-purple-light flex items-center justify-center text-purple-900 mr-1 mt-0.5">3.</div>
              <span>Strategies to balance health, mobility, and nutrition needs.</span>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-purple-light flex items-center justify-center text-purple-900 mr-1 mt-0.5">4.</div>
              <span>Communication scripts and advocacy prompts for families.</span>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-purple-light flex items-center justify-center text-purple-900 mr-1 mt-0.5">5.</div>
              <span>Self-care practices and burnout prevention techniques.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="col-span-full text-center text-gray-500 py-6">No resources found. Try adjusting your search.</div>
);

export default Resources;
