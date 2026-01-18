import { QuizData } from '../types/quiz';

export function getTitle(gender: string): string {
    return gender === 'HOMBRE' 
        ? 'Por Qué Ella Se Fue' 
        : 'Por Qué Él Se Fue';
}

export function getLoadingMessage(gender: string): string {
    return gender === 'HOMBRE'
        ? 'Generando tu protocolo específico para reconquistar a ella...'
        : 'Generando tu protocolo específico para reconquistar a él...';
}

export function getCopy(quizData: QuizData): string {
    const pronoun = quizData.gender === 'HOMBRE' ? 'ella' : 'él';
    const exPronoun = quizData.gender === 'HOMBRE' ? 'Ella' : 'Él';
    
    const whoEnded = quizData.whoEnded || '';
    const timeSeparation = quizData.timeSeparation || '';
    const currentSituation = quizData.currentSituation || '';
    const reason = quizData.reason || '';

    let intro = '';
    if (whoEnded.includes('ELLA TERMINÓ') || whoEnded.includes('ÉL TERMINÓ')) {
        intro = `Basado en que ${exPronoun} decidió terminar la relación, entendemos que hubo un desgaste en los "interruptores de valor" que ${pronoun} percibía en ti. `;
    } else if (whoEnded.includes('YO TERMINÉ')) {
        intro = `Considerando que fuiste tú quien terminó, el desafío ahora es revertir el sentimiento de rechazo que ${pronoun} procesó, transformándolo en una nueva oportunidad. `;
    } else if (whoEnded.includes('DECISIÓN MUTUA')) {
        intro = `Considerando que la decisión fue mutua, el desafío ahora es identificar si aún existe interés genuino de ambas partes y reconstruir la atracción desde cero. `;
    } else {
        intro = `Considerando el contexto de la ruptura, el desafío ahora es comprender las dinámicas emocionales que llevaron a este punto y revertirlas estratégicamente. `;
    }

    let urgency = '';
    if (timeSeparation.includes('MENOS DE 1 SEMANA') || timeSeparation.includes('1-4 SEMANAS')) {
        urgency = `Estás en la **ventana de tiempo IDEAL**. El cerebro de ${pronoun} aún tiene rastros químicos de tu presencia. `;
    } else {
        urgency = `Aunque ha pasado tiempo, la neurociencia explica que las memorias emocionales pueden ser reactivadas mediante los estímulos correctos. `;
    }

    let insight = '';
    if (currentSituation.includes('CONTACTO CERO') || currentSituation.includes('ME IGNORA') || currentSituation.includes('BLOQUEADO')) {
        insight = `El contacto cero es tu mayor ventaja actual para la "limpieza de picos de cortisol" en su cerebro. `;
    } else {
        insight = `El contacto actual indica que el hilo emocional no se ha cortado, pero debemos evitar saturar su sistema de dopamina. `;
    }

    let reasonInsight = reason ? `Al analizar que el motivo fue "${reason}", el protocolo neutralizará esa objeción específica. ` : '';

    return `No fue por falta de amor.

${intro}

${urgency}

${insight}

${reasonInsight}

La clave no es rogar, sino entender la psicología de ${pronoun} y actuar de forma estratégica.`;
}

export function getVentana72Copy(gender: string): string {
    const pronoun = gender === 'HOMBRE' ? 'ella' : 'él';
    return `El cerebro humano opera en ciclos de 72 horas. Cada acción estratégica que tomas abre una nueva ventana de oportunidad.

En cada una de estas 3 fases, hay acciones que activan o borran la atracción de ${pronoun}. Tu plan revela exactamente qué hacer en cada una.`;
}

export function getOfferTitle(gender: string): string {
    return gender === 'HOMBRE'
        ? 'Tu Plan para Reconquistar a Ella'
        : 'Tu Plan para Reconquistar a Él';
}

export function getFeatures(gender: string): string[] {
    const pronoun = gender === 'HOMBRE' ? 'Ella' : 'Él';
    const pronounLower = gender === 'HOMBRE' ? 'ella' : 'él';
    const another = gender === 'HOMBRE' ? 'otro' : 'otra';
    
    return [
        `📱 MÓDULO 1: Cómo Hablar Con ${pronoun} (Días 1-7)`,
        `👥 MÓDULO 2: Cómo Encontrarte Con ${pronoun} (Días 8-14)`,
        `❤️ MÓDULO 3: Cómo Reconquistar${pronounLower === 'ella' ? 'la' : 'lo'} (Días 15-21)`,
        `🚨 MÓDULO 4: Protocolo de Emergencia (Si ${pronounLower} está con ${another})`,
        '⚡ Guía especial: Las 3 Fases de 72 Horas',
        '🎯 Bonos: Scripts de conversación + Planes de acción',
        '✅ Garantía: 30 días o tu dinero de vuelta'
    ];
}

export function getCTA(gender: string): string {
    return gender === 'HOMBRE'
        ? 'SÍ, QUIERO MI PLAN PARA RECONQUISTAR A ELLA'
        : 'SÍ, QUIERO MI PLAN PARA RECONQUISTAR A ÉL';
}

export function getCompletionBadge(gender: string): { title: string; subtitle: string } {
    const pronoun = gender === 'HOMBRE' ? 'ella' : 'él';
    return {
        title: '¡TU ANÁLISIS ESTÁ LISTO!',
        subtitle: `El paso a paso científico para que ${pronoun} QUIERA volver`
    };
}

export function getFaseText(gender: string, fase: number): string {
    const pronoun = gender === 'HOMBRE' ? 'Ella' : 'Él';
    const pronounLower = gender === 'HOMBRE' ? 'ella' : 'él';
    const oppositeGender = gender === 'HOMBRE' ? 'él' : 'ella';
    
    const fases: Record<number, string> = {
        1: `• ${pronoun} recibe la primera señal de cambio en ti.
• Su cerebro activa el "modo curiosidad" y abandona el alivio.
• ⚠️ PELIGRO: Un error aquí confirma que hizo bien en dejarte.`,
        
        2: `• Reactivación de la oxitocina (hormona del apego).
• Las memorias positivas bloqueadas vuelven a su mente.
• ⚠️ PELIGRO: Presionar demasiado causa el cierre definitivo.`,
        
        3: `• Necesidad biológica de resolución emocional.
• Momento ideal para el Protocolo de Reconexión Estratégica.
• ⚠️ PELIGRO: El 87% pierde su oportunidad por no saber actuar aquí.`
    };
    
    return fases[fase] || '';
}