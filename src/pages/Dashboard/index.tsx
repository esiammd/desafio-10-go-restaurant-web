/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React, { useState, useEffect, useCallback } from 'react';

import api from '../../services/api';

import Header from '../../components/Header';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    api
      .get('/foods')
      .then(response => {
        setFoods(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(!editModalOpen);
  }, [editModalOpen]);

  const handleAddFood = useCallback(
    async (food: Omit<IFoodPlate, 'id' | 'available'>) => {
      try {
        const response = await api.post('/foods', {
          ...food,
          available: true,
        });

        setFoods([...foods, response.data]);
      } catch (error) {
        console.log(error);
      }
    },
    [foods],
  );

  const handleDeleteFood = useCallback(
    async (id: number) => {
      try {
        await api.delete(`/foods/${id}`);

        setFoods(foods.filter(food => food.id !== id));
      } catch (error) {
        console.log(error);
      }
    },
    [foods],
  );

  const handleEditFood = useCallback(
    async (food: IFoodPlate) => {
      setEditingFood(food);
      toggleEditModal();
    },
    [toggleEditModal],
  );

  const handleUpdateFood = useCallback(
    async (food: Omit<IFoodPlate, 'id' | 'available'>) => {
      try {
        const response = await api.patch(`/foods/${editingFood.id}`, {
          ...editingFood,
          ...food,
        });

        const editFoods = foods.map(editFood => {
          if (editFood.id === editingFood.id) {
            return response.data;
          }
          return editFood;
        });
        setFoods(editFoods);
      } catch (error) {
        console.log(error);
      }
    },
    [editingFood, foods],
  );

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
        {foods.map(food => (
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
