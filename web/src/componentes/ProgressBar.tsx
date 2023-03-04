interface ProgressBarProps{
    progress: number,
}

export function ProgressBar(props:ProgressBarProps){
    const progressStyles ={
        width: `${props.progress}%`
    }

    return(
        <div className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
            <div
                role="progressbar"
                className="h-3 rounded-xl bg-violet-600 transition-all"
                aria-label="Barra de progresso de hábitos concluidos nesse dia"
                aria-valuenow={props.progress}
                style={progressStyles}
                >
            </div>
        </div>
    )
}