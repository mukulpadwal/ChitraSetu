"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SingleProductForm from "@/components/SingleProductForm";
// import MultipleProductsForm from "@/components/MultipleProductsForm";

function ListProductPage() {
  return (
    <div className="max-w-5xl min-h-screen mx-auto p-4 space-y-6 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center">List a New Product</h1>
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="single" className="w-full">
            List Single
          </TabsTrigger>
          <TabsTrigger value="multiple" className="w-full">
            List Multiple
          </TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <SingleProductForm />
        </TabsContent>
        <TabsContent value="multiple">
          {/* <MultipleProductsForm /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ListProductPage;
