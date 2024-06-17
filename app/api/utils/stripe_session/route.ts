import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  if (!session) { return NextResponse.json({ sessionId: 'Login First' });}
  const { priceId, subscription } = await req.json();
  //const username = session?.user?.name
  let email = session?.user?.email
  if (!email) {email = ''}
  let selection = {email: email}
  let userId = '';
  let userIds = await db.user.findMany({
    where: selection,
    select: {
      id:true
    },
  })
  if (userIds.length != 0) {userId = userIds[0].id}
  if (subscription) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { userId, email, subscription },
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}`,
        allow_promotion_codes: true,
      });


      return NextResponse.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return NextResponse.json({ error: "Failed to create checkout session" });
    }
  } else {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { userId, email, subscription },
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}`,
      });

      console.log("EARLY META", {
        userId,
        email,
        subscription,
      });
      return NextResponse.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return NextResponse.json({ error: "Failed to create checkout session" });
    }
  }
}