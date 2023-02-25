import dayjs from 'dayjs';
import { FastifyInstance } from 'fastify';
import { z } from "zod";
import { prisma } from './prisma'

export async function appRoutes(app: FastifyInstance){
    app.post('/habits', async(request) =>{
        //title. weekdays
        const createHabitBody = z.object({
            title:z.string(),
            weekDay:z.array(z.number().min(0).max(6))
        });
        
        const {title, weekDay} = createHabitBody.parse(request.body);

        const today = dayjs().startOf('day').toDate();

        await prisma.habit.create({
            data:{
                tittle:title,
                created_at: today,
                weekDay:{
                    create: weekDay.map(day => {
                        return{
                            week_day:day,
                        }
                    }),
                }
            }
        });
    });

    app.get('/day',async(request) => {
        const getDayParam = z.object({
            date: z.coerce.date()
        });

        const { date } = getDayParam.parse(request.query);
        //localhost:3333/day?date = 2022-01-13
        const parsedDay = dayjs(date).startOf('day');

        const weekDay = parsedDay.get('day');

        console.log(date , weekDay);

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date
                },
                weekDay: {
                    some: {
                        week_day: weekDay,
                    }
                }
            }
        });

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDay.toDate(),
            },
            include:{
                dayHabit: true,
            }
        })

        const completedHabit = day?.dayHabit.map(dayHabit => { 
            return dayHabit.habit_id
         });
         
        return {
            possibleHabits,
            completedHabit,
        };

    });

    app.patch('/habits/:id/toggle', async(request) => {
        //id = Parâmetro de identificação

        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        })

        const {id} = toggleHabitParams.parse(request.params)

        const today = dayjs().startOf('day').toDate();

        let day = await prisma.day.findUnique({
            where:{
                date:today,
            }
        });

        if(!day){
            day = await prisma.day.create({
                data:{
                    date: today,
                }
            });
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where:{
                day_id_habit_id:{
                    day_id: day.id,
                    habit_id:id,
                }
            }
        });

        if(dayHabit){
            //remover a marcação
            await prisma.dayHabit.delete({
                where:{
                    id:dayHabit.id,
                }
            })
        }else{
            //Completar o hábito e no dia    
            await prisma.dayHabit.create({
                data:{
                    day_id: day.id,
                    habit_id:id,
                }
            });
        }

        
        
    });

    app.get('/summary',async (request) => {
       // [ {date: 27/02, amount: 4 , completed: 1}, {date: 28/02 ...},{} ] 
       
       const summary = await prisma.$queryRaw` 
        SELECT 
            D.id, 
            D.date,
            (
                SELECT 
                    cast(count(*) as float)
                FROM day_habits DH
                WHERE DH.day_id = D.id  
            ) as completed,
            (
                SELECT
                    cast(count(*) as float)
                    FROM habit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                    WHERE 
                        HWD.week_day = cast(strftime('%w',  D.date/1000.0,'unixepoch') as int) 
                        AND H.created_at <= D.date
            ) as amount
        FROM days D
       ` 

       return summary;
    });
}

