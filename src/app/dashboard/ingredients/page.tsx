'use client'

import { useState } from 'react'
import { useIngredients, useAddIngredient } from '@/lib/queries'
import { formatCurrency } from '@/lib/pricing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from '@/components/ui/form'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PlusCircle } from 'lucide-react'

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price_cents: z.coerce.number().int().min(0, 'Price must be a positive number')
})

type FormValues = z.infer<typeof formSchema>

export default function IngredientsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { data: ingredients, isLoading, isError } = useIngredients()
  const addIngredient = useAddIngredient()
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price_cents: 0
    }
  })
  
  const onSubmit = async (values: FormValues) => {
    try {
      await addIngredient.mutateAsync(values)
      form.reset()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Failed to add ingredient:', error)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ingredients</h1>
          <p className="text-muted-foreground">
            Manage your ingredient costs and availability
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Ingredient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Ingredient</DialogTitle>
              <DialogDescription>
                Enter the ingredient details below
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingredient name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price_cents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (in cents)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={addIngredient.isPending}
                  >
                    {addIngredient.isPending ? 'Adding...' : 'Add Ingredient'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div>Loading ingredients...</div>
      ) : isError ? (
        <div className="text-red-500">Error loading ingredients</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No ingredients yet. Add your first ingredient.
                </TableCell>
              </TableRow>
            ) : (
              ingredients?.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell>{ingredient.name}</TableCell>
                  <TableCell>{formatCurrency(ingredient.price_cents)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
} 