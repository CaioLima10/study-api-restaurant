import { knex } from "@/database/knex";
import { Request, Response, NextFunction } from "express";
import z from "zod";


class ProductsController {
  async index(request: Request, response: Response, next: NextFunction) {
    try{

      const { name } = request.query

      const products = await knex<ProductsController>("products")
      .whereLike("name", `%${name ?? ""}%`)
      .select("*")

      return response.json(products)

    }catch(error){
      next(error)
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {

      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0)
      })

      const { name, price } =  bodySchema.parse(request.body)

      await knex<ProductRepository>("products").insert({name, price})

      return response.status(201).json()
    } catch (error) {
      next(error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0)
      })
      
      const bodySchemaParams = z.object({
        id: z.string(),
      })

      const { name, price } = bodySchema.parse(request.body)
      const { id } = bodySchemaParams.parse(request.params)

      await knex<ProductRepository>("products").update({ name, price }).where({ id: id })

      return response.status(200).json()

    } catch (error) {
      next(error)
    }
  }

}

export { ProductsController }