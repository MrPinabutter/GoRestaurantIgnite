import { useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useEffect } from 'react';

interface FoodProps {
  id: number;
  image: string;
  name: string;
  price: number;
  description: string;
}

function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [editingFood, setEditingFood] = useState<FoodProps>(foods[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function componentDidMount() {
      const response = await api.get('/foods');
  
      setFoods(response.data);
    }
    componentDidMount()
  }, [])

  async function handleAddFood(food: FoodProps) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood (food: FoodProps) {
    try {
      if(editingFood){

        const foodUpdated = await api.put(
          `/foods/${editingFood.id}`,
          { ...editingFood, ...food },
        );
          
        const foodsUpdated = foods.map(f =>
          f.id !== foodUpdated.data.id ? f : foodUpdated.data,
        );
          
        setFoods(foodsUpdated);
      }else{
        throw new Error();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood (id: Number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal () {
    setModalOpen(old => !old);
  }

  function toggleEditModal () {
    setEditModalOpen(old => !old);
  }

  function handleEditFood (food: FoodProps) {
    setEditModalOpen(true);
    setEditingFood(food);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
