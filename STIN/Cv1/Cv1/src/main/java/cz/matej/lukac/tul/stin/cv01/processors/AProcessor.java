package cz.matej.lukac.tul.stin.cv01.processors;

public abstract class AProcessor implements IProcessor {
    private AProcessor next;

    public AProcessor(AProcessor next){
        this.next = next;
    }
}
