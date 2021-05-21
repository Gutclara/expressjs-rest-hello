import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Users } from './entities/Users'
import { Exception } from './utils'
import { ToDos } from './entities/ToDos'

export const createUser = async (req: Request, res:Response): Promise<Response> =>{

    // important validations to avoid ambiguos errors, the client needs to understand what went wrong
    if(!req.body.user_name) throw new Exception("Please provide an user_name")
	if(!req.body.first_name) throw new Exception("Please provide a first_name")
	if(!req.body.last_name) throw new Exception("Please provide a last_name")
	if(!req.body.email) throw new Exception("Please provide an email")
	if(!req.body.password) throw new Exception("Please provide a password")

	const userRepo = getRepository(Users)
    // fetch for any user with this email
    //como puse que el mail y el username tienen que ser unicos tengo que comprobar
    const user = await userRepo.findOne({ where: {email: req.body.email }})
	if(user) throw new Exception("Users already exists with this email")
   
    const user_name = await userRepo.findOne({ where: {user_name: req.body.user_name }})
    if(user_name) throw new Exception("User_name already exists")
    
	const newUser = getRepository(Users).create(req.body);  //Creo un usuario
	const results = await getRepository(Users).save(newUser); //Grabo el nuevo usuario 
	return res.json(results);
}

export const getUsers = async (req: Request, res: Response): Promise<Response> =>{
		const users = await getRepository(Users).find();
		return res.json(users);
}

export const  getAllToDos = async (req: Request, res: Response): Promise<Response> =>{
		const todos = await getRepository(ToDos).find({where:{userid:req.params.userid}});
		return res.json(todos);
}

export const postNewToDo = async (req: Request, res: Response): Promise<Response> =>{
        if(!req.body.label) throw new Exception("Please put your task here (label)") //estos if frenan en caso de que no esten completos los campos
        if(!req.body.done) throw new Exception("Please enter done or not (done)")
        if(!req.body.userid) throw new Exception("Please enter your id (userid)")

        let newToDo = new ToDos() //creo una variable con let porque se modifica, le ponemos nueva tarea y se iguala con ese new ToDos que es una nueva tabla.
        newToDo.label = req.body.label //esta nueva tabla tiene atributos label, done y userid. Label esta vacio y se iguala a la solicitud 
        newToDo.done = req.body.done
        newToDo.userid = req.body.userid
        //tengo que guardar la nueva tabla antes de retornar entonces:
        const results = await getRepository(ToDos).save(newToDo)
        //await es que espera a tener todo lo que esta a su derecha pronto
        //getRepository es un metodo para obtener tablas(la que cree es ToDos)
        //save es un metodo que guarda la tabla nueva
        //entonces results obtienen todas las tablas de todos -los repositorios- y le agrega -guarda- la nueva tabla
        return res.json(newToDo);
}

export const putEditToDo = async (req: Request, res: Response): Promise<Response> =>{

        if(!req.body.label) throw new Exception("Please put your task here (label)") 
        if(!req.body.done) throw new Exception("Please enter done or not (done)")
        if(!req.params.todoid) throw new Exception("Please enter your id (userid)")

        let editTodo = await getRepository(ToDos).findOne({where:{id:req.params.todoid}})
        if (!editTodo) throw new Exception("This tasks doesnt exist")//se fija si el campo de tarea esta vacio. si esta vacio no hay nada qu editar
        editTodo.label = req.body.label
        editTodo.done = req.body.done
        
        const results = await getRepository(ToDos).save(editTodo)
        return res.json(editTodo);
}

export const deleteTodo = async (req: Request, res: Response): Promise<Response> =>{
        const deleteTodo = await getRepository(ToDos).find({where:{id:req.params.todoid}});
        if (!deleteTodo) throw new Exception ("nothing to delete")
        let result = await getRepository(ToDos).delete(req.params.todoid)
		return res.json(result);
}