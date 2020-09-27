import {TweenLite, Sine} from 'gsap';
function tweenSteps (target, steps, update, complete, _index) {
    const index = _index | 0;
    if (steps.length > index) {
        let tweenData = {
            onComplete: tweenSteps,
            ease: steps[index].ease ? steps[index].ease : Sine.easeInOut,
            onUpdate: update ? update : () => {},
            onUpdateParams: [index,target,steps],
            onCompleteParams: [target, steps, update, complete, index + 1]
        };
        for(let v in steps[index].values){
            tweenData[v] = steps[index].values[v];

        }
        TweenLite.to(target, Number(steps[index].duration), tweenData);
    }
    else {
        if (complete) {
            complete();
        }
    }
}
function perpetuate(target,values,onUpdate,onIterate){
    tweenSteps(target,values,onUpdate, () => {perpetuate(target,values,onUpdate,onIterate)},onIterate);
}
export {tweenSteps, perpetuate};