"use client";

import { motion } from "framer-motion";

export function MotionDiv(props: any) {
  return <motion.div {...props}>{props.children}</motion.div>;
}

export function MotionSection(props: any) {
  return <motion.section {...props}>{props.children}</motion.section>;
}
