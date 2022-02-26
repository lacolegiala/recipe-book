import express from 'express'
const app = express()
const port = 3000
import {
  createPool, sql,
} from 'slonik';
import * as dotenv from "dotenv";

dotenv.config()

app.use(express.json())

let connectionString: string
if (process.env.PG_CONNECTION_STRING) {
  connectionString = process.env.PG_CONNECTION_STRING
} else {
  throw new Error('Connection string environment variable is not set')
}

const pool = createPool(process.env.PG_CONNECTION_STRING)

app.get('/', (req, res) => {
  res.send('Welcome to your virtual recipe book!')
})

app.get('/recipes', async (req, res) => {
  const allRecipes = pool.connect(async (connection) => {
    return await connection.many(sql`SELECT * FROM recipe`)
  });
  res.send(await allRecipes)
})

app.get('/ingredients', async (req, res) => {
  const allIngredients = pool.connect(async (connection) => {
    return await connection.many(sql`SELECT * FROM ingredient`)
  })
  res.send(await allIngredients)
})

app.get('/meals', async (req, res) => {
  const allMeals = pool.connect(async (connection) => {
    return await connection.many(sql`SELECT * FROM meal`)
  })
  res.send(await allMeals)
})

app.get('/recipes/:id', async (req, res) => {
  const id = req.params.id
  const getRecipe = pool.connect(async (connection) => {
    return await connection.many(sql`
      SELECT * FROM recipe WHERE id=${id}
    `)
  })
  res.send(await getRecipe)
})

app.get('/ingredients/:id', async (req, res) => {
  const id = req.params.id
  const getIngredient = pool.connect(async (connection) => {
    return await connection.many(sql`
      SELECT * FROM ingredient WHERE id=${id}
    `)
  })
  res.send(await getIngredient)
})

app.get('/meals/:id', async (req, res) => {
  const id = req.params.id
  const getMeal = pool.connect(async (connection) => {
    return await connection.many(sql`
      SELECT * FROM meal WHERE id=${id}
    `)
  })
  res.send(await getMeal)
})

app.post('/recipes', async (req, res) => {
  const recipe: {name: string, method: string, servings: number} = req.body
  const addRecipe = pool.connect(async (connection) => {
    return await connection.query(sql`
      INSERT INTO recipe (name, method, servings)
      VALUES (${recipe.name}, ${recipe.method}, ${recipe.servings})
    `)
  })
  res.send(await addRecipe)
})

app.post('/ingredients', async (req, res) => {
  const ingredient: {name: string, foodGroup: string} = req.body
  const addIngredient = pool.connect(async (connection) => {
    return await connection.query(sql`
      INSERT INTO ingredient (name, foodGroup)
      VALUES (${ingredient.name}, ${ingredient.foodGroup})
    `)
  })
  res.send(await addIngredient)
})

app.post('/meals', async (req, res) => {
  const meal: {name: string} = req.body
  const addMeal = pool.connect(async (connection) => {
    return await connection.query(sql`
      INSERT INTO meal (name)
      VALUES (${meal.name})
    `)
  })
  res.send(await addMeal)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})