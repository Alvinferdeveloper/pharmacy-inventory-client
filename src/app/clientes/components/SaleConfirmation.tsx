"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

interface SaleConfirmationProps {
  customerName: string
}

export function SaleConfirmation({ customerName }: SaleConfirmationProps) {
  return (
    <div className="p-6 flex items-center justify-center min-h-[400px] bg-gray-50">
      <Card className="w-full max-w-md text-center shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-primary to-primary/70 p-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>
        </div>
        <CardContent className="pt-6 pb-8">
          <h3 className="text-2xl font-bold mb-2 text-foreground">¡Venta Guardada!</h3>
          <p className="text-muted-foreground mb-6">La venta para <span className="font-semibold text-primary">{customerName}</span> se ha registrado exitosamente.</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ ease: "linear", duration: 1, repeat: Infinity }}
              className="w-4 h-4 border-2 border-dashed border-primary rounded-full"
            />
            <span>Regresando a la lista de clientes...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
