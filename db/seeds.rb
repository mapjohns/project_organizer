# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
project_a = Project.create(name:"Make peanut butter and jelly sandwich", description:"Procure the necessary ingredients and craft this sandwich", due_date: DateTime.new(2022, 11, 20, 12, 0, 0), status:"Incomplete")
project_b = Project.create(name:"Do laundry", description:"It's that time of day, laundry day", due_date: DateTime.new(2022, 11, 22, 12, 0, 0), status:"Incomplete")
