"use client";
import s from "./styles.module.css";
import CartComponent from "@/@features/Cart/component/CartComponent/CartComponent";
import ArrowBack from "@/@Component/ArrowBack/ArrowBack";

function CartPage() {
  return (
    <div>
      <ArrowBack />
      <div className={s.container}>
        <CartComponent brand="Peugeot" model="308" price={250} type="rent" />
      </div>
    </div>
  );
}

export default CartPage;
