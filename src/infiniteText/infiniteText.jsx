import { useEffect, useRef, useState } from 'react'
import styles from './style.module.css'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import nextConfig from '../../next.config'

export default function InfiniteText() {


  const [isMobile,setIsMobile] = useState(false);
  useEffect(()=>{
    const handleResize=()=>{
      setIsMobile(window.innerWidth<600)
    }
    handleResize()
    window.addEventListener("resize",handleResize);
    return()=>window.removeEventListener("resize",handleResize);
  },[])
  const firstText = useRef(null)
  const secondText = useRef(null)
  const slider = useRef(null)
  let xPercent=0;
  let direction = -1;

  const scaler = isMobile?0.05:0.1

  const animation = () =>{
    if(xPercent<= -100){
      xPercent=0;
    }
    if(xPercent> 0){
      xPercent=-100;
    }
    gsap.set(firstText.current, {xPercent:xPercent})
    gsap.set(secondText.current, {xPercent:xPercent})
    xPercent += scaler * direction
    requestAnimationFrame(animation)
  }

  useEffect(()=>{
    gsap.registerPlugin(ScrollTrigger)
    requestAnimationFrame(animation)

    gsap.to(slider.current,{
      scrollTrigger:{
        trigger:document.documentElement,
        start:0,
        end: window.innerHeight,
        scrub:isMobile?true:0.25,
        onUpdate: e => direction = e.direction * -1
      },
      x:isMobile?"-10px":"-300px"
    })
  },[])
  return (
    <>
      <div className={styles.background}>
        <div className={styles.shader}></div>
        <Image
          src={`${nextConfig.basePath}/images/background.webp`}
          fill={true}
          alt='background image'
        />
        <div ref={slider} className={styles.loopContainer} data-scroll data-scroll-speed={0.3}>
          <div className={styles.loop}>
            <p ref={firstText}>Full Stack Developer -</p>
            <p ref={secondText}>Full Stack Developer -</p>
          </div>
        </div>
      </div>
    </>
  )
}
