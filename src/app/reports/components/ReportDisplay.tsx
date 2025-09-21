"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"


interface ReportDisplayProps {
  reportType: string;
  data: any[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function ReportDisplay({ reportType, data, isLoading, error }: ReportDisplayProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  console.log(data)

  useEffect(() => {
    setCurrentPage(1);
  }, [reportType, data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message || "Ocurrió un error al cargar el reporte."}</AlertDescription>
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay datos disponibles para el reporte seleccionado.
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const renderTableHeaders = () => {
    switch (reportType) {
      case "sales-by-date":
      case "sales-by-customer":
      case "sales-by-product":
        return (
          <TableRow>
            <TableHead>Factura ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Precio Unitario</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead>Total Factura</TableHead>
          </TableRow>
        );
      case "inventory":
        return (
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Stock Actual</TableHead>
            <TableHead>Precio Compra</TableHead>
            <TableHead>Precio Venta</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Proveedor</TableHead>
          </TableRow>
        );
      case "products-by-supplier":
        return (
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Stock Actual</TableHead>
            <TableHead>Precio Compra</TableHead>
            <TableHead>Precio Venta</TableHead>
            <TableHead>Categoría</TableHead>
          </TableRow>
        );
      case "users":
        return (
          <TableRow>
            <TableHead>ID de Usuario</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Identificación</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
          </TableRow>
        );
      default:
        return null;
    }
  };

  const renderSalesByDateRows = (item: any, index: number) => (
    <TableRow key={index}>
      <TableCell>{item.idInvoice}</TableCell>
      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
      <TableCell>{item.customer?.customerName}</TableCell>
      <TableCell>{item.user?.name}</TableCell>
      <TableCell>{item.invoiceDetails[0]?.product?.productName}</TableCell>
      <TableCell>{item.invoiceDetails[0]?.quantity}</TableCell>
      <TableCell>{item.invoiceDetails[0]?.unitPrice}</TableCell>
      <TableCell>{item.invoiceDetails[0]?.subtotal}</TableCell>
      <TableCell>{item.total}</TableCell>
    </TableRow>
  );

  const renderSalesByCustomerRows = (item: any, index: number) => (
    <TableRow key={index}>
      <TableCell>{item.idInvoice}</TableCell>
      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
      <TableCell>{item.customer?.customerName}</TableCell>
      <TableCell>{item.user?.name}</TableCell>
      <TableCell>{item.invoiceDetails[0]?.product?.productName}</TableCell>
      <TableCell>{item.invoiceDetails[0]?.quantity}</TableCell>
      <TableCell>{item.invoiceDetails[0]?.unitPrice}</TableCell>
      <TableCell>{item.invoiceDetails[0]?.subtotal}</TableCell>
      <TableCell>{item.total}</TableCell>
    </TableRow>
  );

  const renderSalesByProductRows = (item: any, index: number) => (
    <TableRow key={index}>
      <TableCell>{item.invoice?.idInvoice}</TableCell>
      <TableCell>{new Date(item.invoice?.date).toLocaleDateString()}</TableCell>
      <TableCell>{item.invoice?.customer?.customerName}</TableCell>
      <TableCell>{item.invoice?.user?.name}</TableCell>
      <TableCell>{item.product?.productName}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{item.unitPrice}</TableCell>
      <TableCell>{item.subtotal}</TableCell>
      <TableCell>{item.invoice?.total}</TableCell>
    </TableRow>
  );

  const renderInventoryRows = (item: any, index: number) => (
    <TableRow key={index}>
      <TableCell>{item.code}</TableCell>
      <TableCell>{item.productName}</TableCell>
      <TableCell>{item.stock}</TableCell>
      <TableCell>{item.purchasePrice}</TableCell>
      <TableCell>{item.sellingPrice}</TableCell>
      <TableCell>{item.category?.categoryName}</TableCell>
      <TableCell>{item.supplier?.supplierName}</TableCell>
    </TableRow>
  );

  const renderProductsBySupplierRows = (item: any, index: number) => (
    <TableRow key={index}>
      <TableCell>{item.code}</TableCell>
      <TableCell>{item.supplier?.supplierName}</TableCell>
      <TableCell>{item.productName}</TableCell>
      <TableCell>{item.stock}</TableCell>
      <TableCell>{item.purchasePrice}</TableCell>
      <TableCell>{item.sellingPrice}</TableCell>
      <TableCell>{item.category?.categoryName}</TableCell>
    </TableRow>
  );

  const renderUsersRows = (item: any, index: number) => (
    <TableRow key={index}>
      <TableCell>{item.idUser}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.identification}</TableCell>
      <TableCell>{item.phone}</TableCell>
      <TableCell>{item.email}</TableCell>
      <TableCell>{item.role?.roleName}</TableCell>
    </TableRow>
  );

  const renderTableRows = () => {
    switch (reportType) {
      case "sales-by-date":
        return paginatedData.map(renderSalesByDateRows);
      case "sales-by-customer":
        return paginatedData.map(renderSalesByCustomerRows);
      case "sales-by-product":
        return paginatedData.map(renderSalesByProductRows);
      case "inventory":
        return paginatedData.map(renderInventoryRows);
      case "products-by-supplier":
        return paginatedData.map(renderProductsBySupplierRows);
      case "users":
        return paginatedData.map(renderUsersRows);
      default:
        return null;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Resultados del Reporte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>{renderTableHeaders()}</TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, data.length)} de{" "}
              {data.length} registros
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
